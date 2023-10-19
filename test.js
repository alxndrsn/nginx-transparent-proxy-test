const fetchOpts = {
  redirect: 'manual,
};

describe('nginx-transparent-redirect-proxy', () => {
  describe('express', () => {
		it('should redirect with normal 302 headers', async () => {
			// when
			const res = await fetch('http://localhost:4444', fetchOpts);

			// then
			assert.equal(res.statusCode, '302');
			assert.equal(res.headers.get('location'), 'http://example.com');
		});
	});

	describe('nginx', () => {
		it('should redirect invisibly', async () => {
			// when
			const res = await fetch('http://localhost:5555', fetchOpts);

			// then
			assert.equal(res.statusCode, '200');
			assert.equal(res.headers.get('location'), 'http://localhost:8765');
			// and
			const body = await res.text();
			assert.equal(body, exampleHtml());
		});
	});
});

function exampleHtml() {
	return `<html>
</html>`;
}
