# URL Shortener
---

**Node.js**, **Express**로 개발한 간단한 URL 단축기입니다.

## Features

- URL 단축
- 커스텀 url alias 지정
- 접속 IP 로깅
- stats 페이지 (암호화됨)

stats 페이지를 대칭키 암호화하여 표시합니다. 암호화 로직을 지우면 암호화 없이 사용할 수 있습니다.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   ```

2. Navigate to the project directory:

   ```bash
   cd url-shortener
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

The project uses environment variables to store sensitive information like the **encryption key**. Create a `.env` file in the root of the project and configure it as follows:

```bash
# .env.example
PORT = 3000
ENCRYPTION_KEY=4a3cd4e081675bd8a06b3577724708e619becac1722d7b6f611a13b39fe97404
REDIRECT_TYPE=302 # 301 or 302 (README 참고, default: 302)

# 데이터베이스 설정
DB_DIALECT=sqlite  # 사용할 데이터베이스 종류 (mysql 또는 sqlite)

# SQLite
SQLITE_STORAGE=./database.db

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=url
MYSQL_USER=root
MYSQL_PASSWORD=password
```

아래 코드를 통해 ENCRYPTION_KEY를 생성할 수 있습니다.
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Running the Application

### Development Mode

To run the application in **development mode**, where you will see detailed error messages and automatic reloading:

```bash
npm start
```

Alternatively, if you're using **nodemon** (a tool for auto-reloading):

```bash
npm run dev
```

### Production Mode

To run the application in **production mode**, set the `NODE_ENV` environment variable to `production`:

#### On Linux/MacOS:

```bash
NODE_ENV=production npm start
```

#### On Windows:

```bash
set NODE_ENV=production && npm start
```

---

## Endpoints

### URL 단축 ( /shorten )
| Method | URI       |
| ------ | --------- |
| POST   | /shorten  |

#### Request
| 파라미터      | 설명                               | 필수 여부 |
| ------------- | ---------------------------------- | -------- |
| originalUrl   | 단축할 원본 URL                    | 필수     |
| customAlias   | 선택적으로 생성할 커스텀 별칭       | 선택     |

&nbsp;

### 리디렉션 ( /:shortenedUrl )
| Method | URI              |
| ------ | ---------------- |
| GET    | /{shortenedUrl}  |
#### Request
| 파라미터      | 설명                      | 필수 여부 |
| ------------- | ------------------------- | -------- |
| shortenedUrl  | 리디렉션할 단축된 URL     | 필수     |

&nbsp;

### 통계 페이지 조회 ( /Stats )
| Method | URI                |
| ------ | ------------------ |
| GET    | /stats/{shortenedUrl} |

#### Request
| 파라미터      | 설명                         | 필수 여부 |
| ------------- | ---------------------------- | -------- |
| shortenedUrl  | 통계를 조회할 단축된 URL      | 필수     |
| decryptionKey | 통계 데이터를 복호화할 키     | 필수     |
&nbsp;
#### Response
| 파라미터      | 설명                       | * |
| ------------- | -------------------------- | --- |
| shortenedUrl  | 단축된 URL                  |  |
| accessCount   | 해당 URL로 접속된 횟수       |  |
| accessLogs    | 접속한 IP와 접속 시간의 배열 |  |

## 301 Redirect vs 302 Redirect
URL 리다이렉트에는 301과 302 두 가지 주요 방식이 있습니다.
**이 프로젝트는 302 Redirect**를 사용하도록 되어있으나, 필요시 **.env파일을 통해 변경**할 수 있습니다.

- 301 : 영구적인 리다이렉트. 브라우저와 검색 엔진이 301 리다이렉트를 캐싱하기 때문에, 이후에는 해당 URL로 다시 요청을 보내지 않으며, 이로 인해 재접속에 대한 로깅이 잘 되지 않습니다.
- 302 : 일시적인 리다이렉트. 브라우저가 캐싱하지 않고 매번 서버에 요청을 보내므로, 로깅이 더 원활하게 이루어집니다.


## Encrypted Stats Page
- 작성예정

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
