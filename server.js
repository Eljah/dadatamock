const http = require('http');
const { recordRequest, getMetrics } = require('./metrics');

const PORT = process.env.PORT || 3000;

const BASE_ADDRESS_DATA = {
  postal_code: "101000",
  country: "Россия",
  country_iso_code: "RU",
  federal_district: "Центральный",
  region_fias_id: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
  region_kladr_id: "7700000000000",
  region_iso_code: "RU-MOW",
  region_with_type: "г Москва",
  region_type: "г",
  region_type_full: "город",
  region: "Москва",
  area_fias_id: null,
  area_kladr_id: null,
  area_with_type: null,
  area_type: null,
  area_type_full: null,
  area: null,
  city_fias_id: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
  city_kladr_id: "7700000000000",
  city_with_type: "г Москва",
  city_type: "г",
  city_type_full: "город",
  city: "Москва",
  city_area: null,
  city_district_fias_id: null,
  city_district_kladr_id: null,
  city_district_with_type: null,
  city_district_type: null,
  city_district_type_full: null,
  city_district: null,
  settlement_fias_id: null,
  settlement_kladr_id: null,
  settlement_with_type: null,
  settlement_type: null,
  settlement_type_full: null,
  settlement: null,
  street_fias_id: null,
  street_kladr_id: null,
  street_with_type: null,
  street_type: null,
  street_type_full: null,
  street: null,
  stead_fias_id: null,
  stead_cadnum: null,
  stead_type: null,
  stead_type_full: null,
  stead: null,
  house_fias_id: null,
  house_kladr_id: null,
  house_cadnum: null,
  house_flat_count: null,
  house_type: null,
  house_type_full: null,
  house: null,
  block_type: null,
  block_type_full: null,
  block: null,
  entrance: null,
  floor: null,
  flat_fias_id: null,
  flat_cadnum: null,
  flat_type: null,
  flat_type_full: null,
  flat: null,
  flat_area: null,
  square_meter_price: null,
  flat_price: null,
  room_fias_id: null,
  room_cadnum: null,
  room_type: null,
  room_type_full: null,
  room: null,
  postal_box: null,
  fias_id: "0c5b2444-70a0-4932-980c-b4dc0d3f02b5",
  fias_code: null,
  fias_level: "1",
  fias_actuality_state: "0",
  kladr_id: "7700000000000",
  geoname_id: "524901",
  capital_marker: "0",
  okato: "45000000000",
  oktmo: "45000000",
  tax_office: "7700",
  tax_office_legal: "7700",
  timezone: null,
  geo_lat: "55.75396",
  geo_lon: "37.620393",
  beltway_hit: null,
  beltway_distance: null,
  metro: null,
  divisions: null,
  qc_geo: "4",
  qc_complete: null,
  qc_house: null,
  history_values: null,
  unparsed_parts: null,
  source: null,
  qc: null
};

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const start = Date.now();

  if (req.method === 'GET' && req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
    res.end(getMetrics());
    recordRequest(200, Date.now() - start);
    return;
  }

  const sendResponse = (statusCode, payload) => {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, 200 - elapsed);
    setTimeout(() => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
      recordRequest(statusCode, Date.now() - start);
    }, delay);
  };

  if (req.method === 'POST' && req.url === '/suggestions/api/4_1/rs/suggest/address') {
    parseBody(req, (err, data) => {
      if (err) {
        sendResponse(400, { error: 'Invalid JSON' });
        return;
      }

      const query = data.query || '';
      const suggestions = [];
      for (let i = 1; i <= 5; i++) {
        suggestions.push({
          value: `${query} fake address ${i}`,
          unrestricted_value: `101000, ${query} fake address ${i}`,
          data: { ...BASE_ADDRESS_DATA }
        });
      }

      sendResponse(200, { suggestions });
    });
  } else {
    sendResponse(404, { error: 'Not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Fake Dadata server listening on port ${PORT}`);
});
