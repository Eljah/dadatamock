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

Дополнительно доступен эндпоинт для экспорта метрик в формате Prometheus:

```
GET /metrics
```

Пример запроса:

```bash
curl -X POST http://localhost:3000/suggestions/api/4_1/rs/suggest/address \
  -H 'Content-Type: application/json' \
  -d '{"query": "Москва"}'
```

Пример ответа:

```json
{
  "suggestions": [
    {
      "value": "Москва fake address 1",
      "unrestricted_value": "101000, Москва fake address 1",
      "data": {
        "postal_code": "101000",
        "country": "Россия",
        "country_iso_code": "RU",
        "region_with_type": "г Москва",
        "city": "Москва",
        "fias_level": "1",
        "geo_lat": "55.75396",
        "geo_lon": "37.620393"
      }
    }
  ]
}
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
