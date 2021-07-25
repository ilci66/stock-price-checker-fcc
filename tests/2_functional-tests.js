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
// Viewing the same stock and liking it again: GET request to /api/stock-prices/
  test("Viewing the same stock and liking it again", (done) => {
//this throws and error and not necessary for this one
// I can just send a get req for the same  stock as the one above 
    // let likeCount = 0
    // chai.request(server)
    //   .get('/api/stock-prices/')
    //   .set("content-type", "application/json")
    //   .query({stock: "GOOG", like: "true"})
    //   .end((err, res) => {
    //     assert.equal(res.status, 200)
    //     likeCount = res.body.stockData.likes
    //   }).then(() => {
    //     chai.request(server)
    //     .get('/api/stock-prices/')
    //     .set("content-type", "application/json")
    //     .query({stock: "GOOG", like: "true"})
    //     .end((err, res) => {
    //       assert.equal(res.status, 200)
    //       assert.equal(res.body.stockData.likes, likeCount, "not equal")
    //     })
    //   })
    chai.request(server)
      .get('/api/stock-prices/')
      .set('content-type', "application/json")
      .query({stock: "GOOG", like: "true"})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.stockData.likes, 1)
        assert.equal(res.body.stockData.stock, "GOOG") 
        done()
      })
    
  })
// Viewing two stocks: GET request to /api/stock-prices/
  test('Viewing two stocks', (done) => {
    chai.request(server)
      .get('/api/stock-prices/')
      .set('content-type', "application/json")
      .query({stock:["GOOG", "MSFT"]})
      .end((err, res) => {
        assert.equal(res.status, 200)
        console.log(res.body)
        assert.include(res.body.stockData[0], {stock:"GOOG"})
        assert.include(res.body.stockData[1], {stock:"MSFT"})
        done()
      })

  })
// Viewing two stocks and liking them: GET request to /api/stock-prices/
  test('Viewing two stocks and liking them', (done) => {
    chai.request(server)
    .get('/api/stock-prices/')
    .set('content-type', "application/json")
    .query({stock:["GOOG", "MSFT"], like : "true"})
    .end((err, res) => {
      assert.equal(res.status, 200)
      console.log(res.body)
      assert.include(res.body.stockData[0], {stock:"GOOG"})
      assert.include(res.body.stockData[1], {stock:"MSFT"})
      assert.exists(res.body.stockData[0].rel_likes)
      assert.exists(res.body.stockData[1].rel_likes)
      done()
    })
  })
});
