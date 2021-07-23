'use strict';
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Stock = require('../models.js')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const { ip } = req
      const { stock, like } = req.query;
      //could just like to boolean but yeah
      fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
        .then(res => res.json())
        .then(data => {
          if(!data.symbol){
            res.json({stockData:{ likes : like==="true" ? 1 : 0}})
          }else if(data.symbol){
            Stock.findOne({symbol : data.symbol}, async (err, stock) => {
              if(err) throw err
              else if(!stock){
                const newStock = await new Stock({
                  symbol: data.symbol,
                  likes: like === "true" ? [ip] : []
                })
                newStock.save((err, saved) => {
                  res.json({stockData:{
                      stock: saved.symbol,
                      price: saved.latestPrice, 
                      likes: saved.likes.length
                  }})
                })
              }else{
                if(stock.likes.indexOf(ip) == -1 && like === "true"){
                  stock.likes.push(ip)
                  stock.save((err, updated) => {
                    res.json({stockData:{
                      stock: data.symbol,
                      price: data.latestPrice, 
                      likes: updated.likes.length}
                    })
                  })
                  
                }
              }

            })
            
          }
          
          // console.log(typeof)
          
        })
        
    });
    
    
};
