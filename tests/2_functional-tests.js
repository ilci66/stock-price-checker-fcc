const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("one stock get", (done) =>{
    const like = "false"
    const stock = "goog"
    chai.request(server)
      .get(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
      .end((err, res) => {
        assert.equal(res.stock, "GOOG")
        done()
      })
  })
});
