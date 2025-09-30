# Быстрый запуск LogicLike Voting System

## 🚀 Запуск с Docker (рекомендуется)

1. **Клонируйте репозиторий**
```bash
git clone <repository-url>
cd logiclike-voting-system
```

2. **Запустите все сервисы**
```bash
docker-compose up -d
```

3. **Наполните базу данных тестовыми данными**
```bash
# Подключитесь к контейнеру бэкенда
docker exec -it logiclike-backend sh

# Запустите seed скрипт
npm run seed

# Выйдите из контейнера
exit
```

4. **Откройте приложение**
- Фронтенд: http://localhost:3000
- API: http://localhost:3001

## 🛠 Ручной запуск

### Предварительные требования
- Node.js 16+
- PostgreSQL 12+

### Шаги

1. **Установите зависимости**
```bash
npm install
cd client && npm install && cd ..
```

2. **Настройте базу данных**
```bash
createdb logiclike_voting
```

3. **Настройте переменные окружения**
```bash
cp env.example .env
# Отредактируйте .env файл с вашими настройками БД
```

4. **Запустите приложение**
```bash
# Терминал 1 - Бэкенд
npm run dev:server

# Терминал 2 - Фронтенд
npm run dev:client

# Терминал 3 - Наполнение БД
npm run seed
```

5. **Откройте http://localhost:3000**

## ✅ Проверка работы

1. Откройте http://localhost:3000
2. Вы должны увидеть список идей с кнопками "Проголосовать"
3. Попробуйте проголосовать за несколько идей
4. Проверьте, что голоса засчитываются и счетчики обновляются
5. Попробуйте проголосовать за одну идею дважды - должна появиться ошибка

## 🐛 Устранение неполадок

### Проблема: "Cannot connect to database"
- Убедитесь, что PostgreSQL запущен
- Проверьте настройки в .env файле
- Убедитесь, что база данных `logiclike_voting` создана

### Проблема: "Port already in use"
- Измените порт в .env файле
- Или остановите процесс, использующий порт

### Проблема: "Module not found"
- Удалите node_modules и переустановите зависимости
```bash
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 📊 Тестовые данные

После запуска seed скрипта в базе будет:
- 15 идей для голосования
- ~50 случайных голосов от разных IP-адресов
- Готовые данные для тестирования функционала

## 🔧 Полезные команды

```bash
# Просмотр логов Docker
docker-compose logs -f

# Остановка всех сервисов
docker-compose down

# Пересборка контейнеров
docker-compose up --build

# Очистка данных
docker-compose down -v
```
