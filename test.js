const fs = require('fs');
const { assert } = require('chai');

const fetchOpts = {
  redirect: 'manual',
};

describe('nginx-transparent-redirect-proxy', () => {
  describe('direct request to example.com (for comparison)', () => {
    it('should return 200 with normal HTML', async () => {
      // when
      const res = await fetch('http://example.com', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, exampleHtml('index.html'));
    });
  });

  describe('express', () => {
    it('should redirect / with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.org');
    });

    it('should serve /some-path from express', async () => {
      // when
      const res = await fetch('http://localhost:4444/some-path', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, 'ok');
    });

    it('should redirect /file/1 with x-secret-token response header', async () => {
      // when
      const res = await fetch('http://localhost:4444/file/1', {
        ...fetchOpts,
        headers: {
          ...fetchOpts.headers,
          'x-should-be-stripped': 'true',
        }
      });

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://127.0.0.1:4445/1');
      assert.isNull(res.headers.get('authorization'));
      assert.equal(res.headers.get('x-secret-token'), 'top-secret-token');
    });

    it('should redirect /example/upstream_exists with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444/example/upstream_exists', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com/index.html');
    });

    it('should redirect /example/upstream_404 with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444/example/upstream_404', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com/missing');
    });
  });

  describe('nginx', () => {
    it('should redirect / with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:5555', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.org');
    });

    it('should serve /some-path from express', async () => {
      // when
      const res = await fetch('http://localhost:5555/some-path', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, 'ok');
    });

    it('should serve /file/1 from file-server with transparent auth', async () => {
      // when
      const res = await fetch('http://localhost:5555/file/1', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      assert.isNull(res.headers.get('authorization'));
      assert.isNull(res.headers.get('x-secret-token'));
      // and
      const body = await res.text();
      assert.equal(body, 'one');
    });

    it('should redirect /example/upstream_exists invisibly', async () => {
      // when
      const res = await fetch('http://localhost:5555/example/upstream_exists', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, exampleHtml('index.html'));
    });

    it('should redirect /example/upstream_404 invisibly', async () => {
      // when
      const res = await fetch('http://localhost:5555/example/upstream_404', fetchOpts);

      // then
      assert.equal(res.status, '404');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, exampleHtml('404.html'));
    });
  });
});

function exampleHtml(filename) {
  return fs.readFileSync(`./example.com.${filename}`, { encoding:'utf-8' });
}
