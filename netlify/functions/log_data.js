// Netlify Function wrapper for api/log_data.js
// Keeps original telegram logic intact, adapts to Netlify event format
const handler = require('../../api/log_data');

// Netlify Functions (v1) event -> mock req/res and delegate
exports.handler = async (event, context) => {
  const headers = event.headers || {};
  // normalize header keys to lower case
  const lowerHeaders = {};
  for (const [k, v] of Object.entries(headers)) lowerHeaders[k.toLowerCase()] = v;

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = {};
    }
  }

  // Build Express-compatible req mock
  const req = {
    method: event.httpMethod || 'POST',
    headers: lowerHeaders,
    body,
    socket: { remoteAddress: event.headers['x-nf-client-connection-ip'] || lowerHeaders['x-nf-client-connection-ip'] || '' },
  };

  // Capture res response
  let statusCode = 200;
  let responseBody = null;
  let responseHeaders = {};

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(obj) {
      responseBody = JSON.stringify(obj);
      responseHeaders['Content-Type'] = 'application/json';
      return this;
    },
    send(msg) {
      responseBody = typeof msg === 'string' ? msg : JSON.stringify(msg);
      return this;
    },
    setHeader(k, v) {
      responseHeaders[k] = v;
    },
  };

  await handler(req, res);

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...responseHeaders },
    body: responseBody || '',
  };
};
