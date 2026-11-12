exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Kun POST er tillatt' }) };
  }
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  // also support urlencoded
  if (!body.fnr && event.body && event.body.includes('fnr=')) {
    const params = new URLSearchParams(event.body);
    body.fnr = params.get('fnr');
  }
  const fnr = body.fnr;
  if (!fnr) return { statusCode: 400, body: 'FNR not provided.' };
  console.log('FNR received:', fnr);
  return { statusCode: 200, body: 'FNR received successfully.' };
};
