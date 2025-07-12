const metrics = {
  requestCounter: 0,
  totalDuration: 0,
  errorCounter: 0
};

function recordRequest(statusCode, duration) {
  metrics.requestCounter += 1;
  metrics.totalDuration += duration;
  if (statusCode >= 400) {
    metrics.errorCounter += 1;
  }
}

function getMetrics() {
  const avgDuration = metrics.requestCounter ? metrics.totalDuration / metrics.requestCounter : 0;
  return [
    '# HELP http_requests_total Total HTTP requests',
    '# TYPE http_requests_total counter',
    `http_requests_total ${metrics.requestCounter}`,
    '# HELP http_requests_errors_total Total HTTP error responses',
    '# TYPE http_requests_errors_total counter',
    `http_requests_errors_total ${metrics.errorCounter}`,
    '# HELP http_request_duration_ms_avg Average request duration in milliseconds',
    '# TYPE http_request_duration_ms_avg gauge',
    `http_request_duration_ms_avg ${avgDuration}`
  ].join('\n');
}

module.exports = { recordRequest, getMetrics };
