const express = require('express');
const router = express.Router();
const Url = require('../models/url');
const AccessLog = require('../models/accessLog');

// POST /shorten
router.post('/shorten', async (req, res) => {
    const { originalUrl, customAlias, length = 3, overwrite = false } = req.body;

    let shortenedUrl;

    // Custom alias logic
    if (customAlias) {
        const existingUrl = await Url.findOne({ where: { shortenedUrl: customAlias } });

        if (existingUrl && !overwrite) {
            return res.status(400).json({
                error: 'Custom alias already exists. Would you like to overwrite?',
                alias: customAlias
            });
        }
        // else if (existingUrl && overwrite) {
        //     await Url.update({ originalUrl }, { where: { shortenedUrl: customAlias } });
        //     return res.json({ shortenedUrl: customAlias, message: 'Alias successfully overwritten.' });
        // }
        shortenedUrl = customAlias;
    } else {
        shortenedUrl = await generateUniqueShortenedUrl(length);
    }

    // Save the URL in the database
    const newUrl = await Url.create({ originalUrl, shortenedUrl });

    res.json({ shortenedUrl: newUrl.shortenedUrl });
});

// GET /:shortenedUrl
router.get('/:shortenedUrl', async (req, res) => {
    const { shortenedUrl } = req.params;

    // Find the original URL
    const urlData = await Url.findOne({ where: { shortenedUrl } });
    if (!urlData) {
        return res.status(404).json({ error: 'URL not found' });
    }

    // Log IP address and access time
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await AccessLog.create({
        shortenedUrl,
        ipAddress,
        accessTime: new Date()
    });

    // Use 301 Moved Permanently redirect
    // Use 302 for temporary redirect
    res.redirect(parseInt(process.env.REDIRECT_TYPE || '302'), urlData.originalUrl);
});

// Encryption logic for stats
//TODO 파일 분리
const crypto = require('crypto');

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey || encryptionKey.length !== 64) {  // 64 characters = 256-bit hex key
    throw new Error('Encryption key must be a 256-bit key in hex format.');
}

// Encryption function
function encrypt(text, key) {
    const iv = crypto.randomBytes(16);  // Generate a 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;  // Return IV + encrypted data
}

// GET /stats/:shortenedUrl
router.get('/stats/:shortenedUrl', async (req, res) => {
    const { shortenedUrl } = req.params;

    // Find the URL entry
    const urlData = await Url.findOne({ where: { shortenedUrl } });
    if (!urlData) {
        return res.status(404).json({ error: 'URL not found' });
    }

    // Find all access logs for this shortened URL
    const logs = await AccessLog.findAll({ where: { shortenedUrl } });
    const totalVisits = logs.length;

    const statsContent = JSON.stringify({
        originalUrl: urlData.originalUrl,
        shortenedUrl: urlData.shortenedUrl,
        totalVisits: totalVisits,
        logs: logs.map(log => ({
            ipAddress: log.ipAddress,
            accessTime: log.accessTime
        }))
    });

    // Encrypt the stats data
    const encryptedContent = encrypt(statsContent, encryptionKey);

    // Render the encrypted content on the page
    res.render('encryptedStats', { encryptedContent });
});

async function generateUniqueShortenedUrl(length) {
    let shortenedUrl;
    let isUnique = false;

    // Base56 characters (Removed 'O', 'o', '0', 'I', and 'l' to avoid confusion)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';

    while (!isUnique) {
        shortenedUrl = generateRandomString(chars, length);
        const existingUrl = await Url.findOne({ where: { shortenedUrl } });
        if (!existingUrl) {
            isUnique = true;
        }
    }

    return shortenedUrl;
}

function generateRandomString(chars, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = router;