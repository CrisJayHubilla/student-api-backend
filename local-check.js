// local-check.js  (not deployed; run with: node local-check.js)
const handler = require('./api/index.js');

function makeRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; }
  };
  return res;
}

async function call(method, body) {
  const req = { method, body, headers: {} };
  const res = makeRes();
  await handler(req, res);
  return res;
}

(async () => {
  const options = await call('OPTIONS');
  console.log('OPTIONS ->', options.statusCode, JSON.stringify(options.headers));

  const post = await call('POST', { title: 'Smoke Test', content: 'hello world' });
  console.log('POST   ->', post.statusCode, JSON.stringify(post.body));

  const get = await call('GET');
  console.log('GET    ->', get.statusCode, JSON.stringify(get.body).slice(0, 200));

  const put = await call('PUT');
  console.log('PUT    ->', put.statusCode, JSON.stringify(put.body));

  process.exit(0);
})();
