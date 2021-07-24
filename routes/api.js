'use strict';
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Stock = require('../models.js')

module.exports = function (app) {
  const stockFinder = (stock) => {
    fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
    .then(res => res.json())
    .then(data => {
      if(!data.symbol){
        return false
      }else if(data.symbol){
        return {stock: data.symbol, price:data.latestPrice}
      }
    })
  }
  const stockCreator = (stock, like, ip) => {
    if(!stockFinder(stock)){
      Stock.findOne({symbol: stock}, (err, data) => {
        if(err)throw err
        else if(data){
          if(like === "true"){
            if(data.likes.indexOf(ip) == -1){
              // data.likes.push(ip)
              // data.save((err, saved) => {return saved})
              //gonna try chaining like this if it doesn't work delete it
              console.log("data exists in db, adding like in the array")
              data.likes.push(ip).save((err, saved) => {
                console.log("ip pushed into array and saved")
                return saved
              })
            }else{
              console.log("data exists in db and liked but like already in the array")
              return data}
          }else{
            console.log("data exists in db, no like")
            return data
          }
          console.log(data)
          return data
        }else{
          console.log("no data in db")
          const newStock = new Stock({
            symbol: stock,
            likes: like === "true" ? [ip] :[]
          })
          newStock.save((err, saved) => {
            console.log("created stock in database" ,saved)
            return saved 
          })
        }
      })
    }
  }




  app.route('/api/stock-prices')
    .get(function (req, res){
      // const { ip } = req
      // const { stock, like } = req.query;
      // console.log(stock.length)
      // //could just like to boolean but yeah
      // if(stock.length !== 2){
      //   fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
      //     .then(res => res.json())
      //     .then(data => {
      //       if(!data.symbol){
      //         Stock.findOne({symbol : data.symbol}, (err, stock) =>{
      //           if(err) throw err
      //           if(!stock){
      //             const newStock = new Stock({
      //               symbol: stock,
      //               likes: like === "true" ? [ip] : []
      //             })
      //             newStock.save((err, saved) => {
      //               console.log("here",saved)
      //               res.json({stockData:{ likes : saved.likes.length}})
      //             })
      //           }else{
      //             console.log("there",stock)
      //             res.json({stockData:{ likes : stock.likes.length}})
      //           }
      //         })
              
      //       }else if(data.symbol){
      //         Stock.findOne({symbol : data.symbol}, (err, stock) => {
      //           if(err) throw err
      //           else if(!stock){
      //             console.log('no such stock')
      //             const newStock = new Stock({
      //               symbol: data.symbol,
      //               likes: like === "true" ? [ip] : []
      //             })
      //             newStock.save((err, saved) => {
      //               console.log('saved the stock')
      //               res.json({stockData:{
      //                   stock: saved.symbol,
      //                   price: data.latestPrice, 
      //                   likes: saved.likes.length
      //               }})
      //             })
      //           }else{
      //             if(stock.likes.indexOf(ip) == -1 && like === "true"){
      //               console.log("there's stock and adding like")
      //               stock.likes.push(ip)
      //               stock.save((err, updated) => {
      //                 console.log('found the stock and added like')
      //                 res.json({stockData:{
      //                   stock: data.symbol,
      //                   price: data.latestPrice, 
      //                   likes: updated.likes.length}
      //                 })
      //               }) 
      //             }
      //             else{
      //               console.log("there's stock but not adding like")
      //               res.json({stockData:{
      //                 stock: stock.symbol,
      //                 price: data.latestPrice,
      //                 likes: stock.likes.length
      //               }})
      //             }
      //           }
      //         })
      //       }
      //   })
      // }else{
      //   console.log(stock)
      //   const [stock1, stock2] = stock
      //   console.log(stock1, stock2)
      //   const obj1 = {}
      //   const obj2 = {}

      //   fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock1}/quote`)
      //     .then(res => res.json())
      //     .then(data => {
      //       if(!data.symbol)
      //         obj1
      //     })

      //   res.json({yo:"now there are multiple"})
        
      // }
        
      //   // app.route('/api/stock-prices')
      //   // .get(function (req, res){
          
      //   // }
    });
    
    
};
