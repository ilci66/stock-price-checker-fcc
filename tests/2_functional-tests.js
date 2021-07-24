const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // test("one stock get", (done) =>{
  //   const checkbox = "false"
  //   const stock = "goog"
  //   chai.request(server)
  //     .get(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
  //     .end((err, res) => {
  //       console.log(res)
  //       // assert.equal(res.stock, "GOOG")
  //       done()
  //     })
  // })
  test('GET req one stock', (done) => {
    chai.request(server)
      .get('/api/stock-prices/')
      //I keep forgetting to set the header
      .set("content-type", "application/json")
      .query({ stock: "GOOG"})
      .end((err, res) => {
        assert.equal(res.status, 200)
        //it's not directly res it's carried in body 
        assert.equal(res.body.stockData.stock, "GOOG")
        done();
      })
  });
  test('Viewing one stock and liking it', (done) => {
    chai.request(server)
      .get('/api/stock-prices/')
      .set("content-type", "application/json")
      .query({stock: "GOOG", like:"true"})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG")
        assert.isAbove(res.body.stockData.likes, 0)
        done()
      })
  })

});
