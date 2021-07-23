'use strict';
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Stock = require('../models.js')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      // console.log(req.ip)
      const { ip } = req
      const { stock, like } = req.query;
      console.log(like)
      fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
        .then(res => res.json())
        .then(data => {
          // console.log(data)
          if(!data.symbol){
            res.json({stockData:{ likes : like==="true" ? 1 : 0}})
          }else if(data.symbol){
            Stock.findOne({stock : data.symbol}, async (err, stock) => {
              if(err) throw err
              else if(!stock){
                const newStock = await new Stock({
                  stock: data.symbol,
                  likes: like ? [ip] : []
                })
                newStock.save()
              }else{
                if(data.likes.indexOf(ip) = -1 && like){
                  const pushed = await data.likes.push(ip)
                  const saved = await data.save()
                }
              }
            })
            res.json({stockData:{stock:data.symbol, price:data.latestPrice}})
          }
          
          // console.log(typeof)
          
        })
        
    });
    
    
};
