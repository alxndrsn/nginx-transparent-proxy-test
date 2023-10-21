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
      assert.equal(body, exampleHtml());
    });
  });

  describe('express', () => {
    it('should redirect / with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com');
    });

    it('should redirect /download/whatever with normal 307 headers', async () => {
      // when
      const res = await fetch(`http://localhost:4444/download/some.file`, fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com/index.html');
    });
  });

  describe('nginx', () => {
    it('should redirect / with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:5555', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com');
    });

    it('should redirect /download/whatever invisibly', async () => {
      // when
      const res = await fetch(`http://localhost:5555/download/some.file`, fetchOpts);

      // then
      assert.equal(res.status, '200');
      assert.isNull(res.headers.get('location'));
      // and
      const body = await res.text();
      assert.equal(body, exampleHtml());
    });
  });
});

function exampleHtml() {
  return fs.readFileSync('./example.com.index.html', { encoding:'utf-8' });
}
