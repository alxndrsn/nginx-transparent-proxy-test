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

    it('should redirect /download/upstream_exists with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444/download/upstream_exists', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com/index.html');
    });

    it('should redirect /download/upstream_404 with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444/download/upstream_404', fetchOpts);

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

    it('should redirect /download/upstream_exists invisibly', async () => {
      // when
      const res = await fetch('http://localhost:5555/download/upstream_exists', fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, exampleHtml('index.html'));
    });

    it('should redirect /download/upstream_404 invisibly', async () => {
      // when
      const res = await fetch('http://localhost:5555/download/upstream_404', fetchOpts);

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
