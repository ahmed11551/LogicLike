# LogicLike - Система голосования за идеи

Система для публичного голосования за идеи развития продукта с ограничением по IP-адресам.

## Особенности

- **Ограничение голосования**: максимум 10 голосов с одного IP-адреса
- **Защита от накруток**: проверка IP-адресов с поддержкой reverse-proxy
- **Современный стек**: Node.js + TypeScript + Express + React + PostgreSQL
- **Responsive дизайн**: адаптивный интерфейс для всех устройств

## Архитектура

### Бэкенд
- **Node.js + TypeScript + Express** - серверная часть
- **PostgreSQL** - база данных
- **Rate limiting** - защита от спама
- **CORS** - настройка для фронтенда

### Фронтенд
- **React + TypeScript** - клиентская часть
- **Responsive CSS** - адаптивный дизайн
- **Error handling** - обработка ошибок
- **Loading states** - индикаторы загрузки

## Быстрый старт

### Предварительные требования

- Node.js 16+ 
- PostgreSQL 12+
- npm или yarn

### Установка

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd logiclike-voting-system
```

2. **Установите зависимости**
```bash
# Установка зависимостей бэкенда
npm install

# Установка зависимостей фронтенда
cd client
npm install
cd ..
```

3. **Настройте базу данных**
```bash
# Создайте базу данных PostgreSQL
createdb logiclike_voting

# Или через psql
psql -U postgres
CREATE DATABASE logiclike_voting;
```

4. **Настройте переменные окружения**
```bash
# Скопируйте файл с примером конфигурации
cp env.example .env

# Отредактируйте .env файл
DB_HOST=localhost
DB_PORT=5432
DB_NAME=logiclike_voting
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3001
```

5. **Запустите приложение**

**Вариант 1: Запуск в режиме разработки (рекомендуется)**
```bash
# Запуск бэкенда и фронтенда одновременно
npm run dev
```

**Вариант 2: Запуск по отдельности**
```bash
# Терминал 1 - Бэкенд
npm run dev:server

# Терминал 2 - Фронтенд  
npm run dev:client
```

6. **Наполните базу данных тестовыми данными**
```bash
# В отдельном терминале
npm run seed
```

### Доступ к приложению

- **Фронтенд**: http://localhost:3000
- **API**: http://localhost:3001
- **Health check**: http://localhost:3001/api/health

## API Документация

### GET /api/ideas
Получить список всех идей, отсортированных по количеству голосов.

**Ответ:**
```json
[
  {
    "id": 1,
    "title": "Название идеи",
    "description": "Описание идеи",
    "votes": 15,
    "created_at": "2024-01-01T00:00:00.000Z",
    "has_voted": false
  }
]
```

### POST /api/ideas/:id/vote
Проголосовать за идею.

**Параметры:**
- `id` (number) - ID идеи

**Ответ при успехе:**
```json
{
  "id": 1,
  "title": "Название идеи",
  "description": "Описание идеи", 
  "votes": 16,
  "created_at": "2024-01-01T00:00:00.000Z",
  "has_voted": true
}
```

**Ошибки:**
- `409 Conflict` - Превышен лимит голосов или уже голосовали за эту идею
- `404 Not Found` - Идея не найдена
- `400 Bad Request` - Неверный ID идеи

### GET /api/health
Проверка состояния сервера.

**Ответ:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Структура базы данных

### Таблица `ideas`
```sql
CREATE TABLE ideas (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `votes`
```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(idea_id, ip_address)
);
```

## Логика голосования

1. **Определение IP-адреса**: Система проверяет заголовки `X-Forwarded-For` и `X-Real-IP` для работы за reverse-proxy
2. **Проверка лимита**: Максимум 10 голосов с одного IP-адреса
3. **Проверка дублирования**: Один голос за идею с одного IP
4. **Атомарность**: Голосование выполняется в транзакции

## Развертывание в продакшене

### Docker (рекомендуется)

1. **Создайте docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: logiclike_voting
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: logiclike_voting
      DB_USER: postgres
      DB_PASSWORD: your_password
      NODE_ENV: production
    depends_on:
      - postgres

volumes:
  postgres_data:
```

2. **Создайте Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

3. **Запустите:**
```bash
docker-compose up -d
```

### Ручное развертывание

1. **Соберите приложение:**
```bash
npm run build
```

2. **Настройте reverse-proxy (Nginx):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Запустите сервер:**
```bash
NODE_ENV=production npm start
```

## Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm start` - Запуск продакшен версии
- `npm run seed` - Наполнение БД тестовыми данными

## Технические детали

### Безопасность
- Rate limiting для защиты от спама
- Валидация входных данных
- Защита от SQL-инъекций через параметризованные запросы
- CORS настройки

### Производительность
- Индексы для быстрого поиска по IP и ID идеи
- Атомарные транзакции
- Кэширование на уровне приложения (можно добавить Redis)

### Масштабируемость
- Статeless архитектура
- Возможность горизонтального масштабирования
- Готовность к добавлению Redis для кэширования

## Лицензия

MIT License
