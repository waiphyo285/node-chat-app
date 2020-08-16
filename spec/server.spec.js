var request = require('request');
describe('calc', () => {
    it('multiply 2 * 2', () => {
        expect(2*2).toBe(4);
    })
})
describe('get message', () => {
    it('should return 200 ok', (done) => {
        request.get('http://localhost:3000/message', (err, res) => {
            expect(res.statusCode).toEqual(200)
            done()
        });
    })
    it('should return list ok', (done) => {
        request.get('http://localhost:3000/message', (err, res) => {
            expect(res.body.length).toBeGreaterThan(10)
            done()
        });
    })
})