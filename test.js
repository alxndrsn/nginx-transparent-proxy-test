const fs = require('fs');
const { assert } = require('chai');

const fetchOpts = {
  redirect: 'manual',
};

describe('nginx-transparent-redirect-proxy', () => {
  describe('express', () => {
    it('should redirect / with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444', fetchOpts);

      // then
      assert.equal(res.status, '307');
      assert.equal(res.headers.get('location'), 'http://example.com');
    });

    it('should redirect /download with normal 307 headers', async () => {
      // when
      const res = await fetch('http://localhost:4444/download', fetchOpts);

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

    it('should redirect /download invisibly', async () => {
      // when
      const res = await fetch('http://localhost:5555/download', fetchOpts);

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
