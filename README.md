# dadatamock

Мокаем сервис DaData для нагрузочного тестирования.
Каждый запрос обрабатывается ровно за 200&nbsp;мс независимо от нагрузки.

## Запуск

```bash
node server.js
```

Сервис слушает порт `3000` по умолчанию и предоставляет единственный эндпоинт:

```
POST /suggestions/api/4_1/rs/suggest/address
```

Пример запроса:

```bash
curl -X POST http://localhost:3000/suggestions/api/4_1/rs/suggest/address \
  -H 'Content-Type: application/json' \
  -d '{"query": "Москва"}'
```

## Docker

Сервис можно запустить в контейнере:

```bash
docker build -t dadatamock .
docker run -p 3000:3000 dadatamock
```

В репозитории присутствует workflow GitHub Actions, который собирает и
публикует образ в Docker Hub. Для работы workflow необходимо задать секреты
`DOCKERHUB_USERNAME` и `DOCKERHUB_TOKEN` в настройках репозитория.
