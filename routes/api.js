'use strict';
const mongoose = require('mongoose')
const fetch = require('node-fetch')
const Stock = require('../models.js')


const findStockInDatabase = async (stock) => {
  return await Stock.findOne({ symbol: stock }).exec();
}

const saveStock = async (stock, like, ip) => {
  let saved = {}
  const foundStock = await findStockInDatabase(stock);
  if(foundStock){
    if(like === "true" && foundStock.likes.indexOf(ip) === -1){
      foundStock.likes.push(ip);
    }
    saved = await foundStock.save()
    return saved;
  }else{
    const created = await createStock(stock, like, ip);
    saved = created;
    return saved;
  }
}

const createStock = async (stock, like, ip) => {
  const newStock = new Stock({
    symbol:stock,
    likes: like==="true" ? [ip] : []
  });
  const savedNewStock = await newStock.save();
  return savedNewStock
}

const getStockData = async (stock) => {
  const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
  const { symbol, latestPrice } = await response.json();
  return { symbol, latestPrice };
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async (req, res) => {
      const { ip } = req;
      const { stock, like } = req.query;

      if(Array.isArray(stock)){
        console.log("stocks", stock);

        const { symbol, latestPrice } = await getStockData(stock[0])
        //this is really cool and I just used it for the first time
        const { symbol: symbol2, latestPrice: latestPrice2 } = await getStockData(stock[1])
        //directly pulling data and changing

        const firstStockSaved = await saveStock(stock[0], like, ip);
        const secondStockSaved = await saveStock(stock[1], like, ip);

        let stockData = []
        if(!symbol){
          //need the realtive here
          stockData.push({rel_likes: firstStockSaved.likes.length - secondStockSaved.likes.length})
        }else{
          stockData.push({
            stock:symbol,
            price:latestPrice,
            rel_likes:firstStockSaved.likes.length - secondStockSaved.likes.length
          })
        }
        if(!symbol2){
          stockData.push({
            rel_likes: secondStockSaved.likes.length - firstStockSaved.likes.length
          });
        }else{
          stockData.push({
            stock:symbol2,
            price:latestPrice2,
            rel_likes:secondStockSaved.likes.length - firstStockSaved.likes.length 
          })
        }
        res.json({stockData})
        // res.json({message:"multiple"})
        return
      }

      const { symbol, latestPrice } = await getStockData(stock)
      // console.log(symbol, latestPrice)
      // res.json({message: "a lot cleaner this way"})
      if(!symbol){
        const saved = await saveStock(stock, like, ip)
        console.log("saved",saved)
        res.json({stockData:{likes:saved.likes.length}})
      }
      const stockDataForOne = await saveStock(stock, like, ip);
      res.json({stockData:{
        stock:symbol,
        price:latestPrice,
        likes:stockDataForOne.likes.length}
      })
    })
}
// module.exports = function (app) {
  
//   let result = undefined

//   const stockFinder = (stock) => {
//     fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
//     .then(res => res.json())
//     .then(data => {
//       if(!data.symbol){
//         return false
//       }else if(data.symbol){
//         return {stock: data.symbol, price:data.latestPrice}
//       }
//     })
//   }
//   const stockCreator = async (stock, like, ip) => {
    
//     if(!stockFinder(stock)){
//       Stock.findOne({symbol: stock}, async (err, data) => {
//         if(err)throw err
//         else if(data){
//           if(like === "true"){
//             if(data.likes.indexOf(ip) == -1){
//               const pushed = await data.likes.push(ip)
//               data.save((err, saved) => {
//                 return result = saved
//               })
//             }else{
//               console.log("data exists in db and liked but like already in the array")
//               return result = data
//             }
//           }else{
//             console.log("data exists in db, no like",data)
//             return result = data
//           }
//           console.log(data)
//           return result = data
//         }else{
//           console.log("no data in db")
//           const newStock = new Stock({
//             symbol: stock,
//             likes: like === "true" ? [ip] : []
//           })
//           newStock.save((err, saved) => {
//             console.log("created stock in database" ,saved)
//             return result = saved 
//           })
//         }
//       })
      
//     }
    
//   }




//   app.route('/api/stock-prices')
//     .get(function (req, res){
//       const { ip } = req
//       const { stock, like } = req.query;
//       console.log("stock >>> ",stock)
//       console.log("stockcreator",stockCreator(stock, like, ip))
//       res.json({message: "rewriting the code "})
//       console.log(stock.length)
//       //could just like to boolean but yeah
//       if(stock.length !== 2){
//         fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
//           .then(res => res.json())
//           .then(data => {
//             if(!data.symbol){
//               Stock.findOne({symbol : data.symbol}, (err, stock) =>{
//                 if(err) throw err
//                 if(!stock){
//                   const newStock = new Stock({
//                     symbol: stock,
//                     likes: like === "true" ? [ip] : []
//                   })
//                   newStock.save((err, saved) => {
//                     console.log("here",saved)
//                     res.json({stockData:{ likes : saved.likes.length}})
//                   })
//                 }else{
//                   console.log("there",stock)
//                   res.json({stockData:{ likes : stock.likes.length}})
//                 }
//               })
              
//             }else if(data.symbol){
//               Stock.findOne({symbol : data.symbol}, (err, stock) => {
//                 if(err) throw err
//                 else if(!stock){
//                   console.log('no such stock')
//                   const newStock = new Stock({
//                     symbol: data.symbol,
//                     likes: like === "true" ? [ip] : []
//                   })
//                   newStock.save((err, saved) => {
//                     console.log('saved the stock')
//                     res.json({stockData:{
//                         stock: saved.symbol,
//                         price: data.latestPrice, 
//                         likes: saved.likes.length
//                     }})
//                   })
//                 }else{
//                   if(stock.likes.indexOf(ip) == -1 && like === "true"){
//                     console.log("there's stock and adding like")
//                     stock.likes.push(ip)
//                     stock.save((err, updated) => {
//                       console.log('found the stock and added like')
//                       res.json({stockData:{
//                         stock: data.symbol,
//                         price: data.latestPrice, 
//                         likes: updated.likes.length}
//                       })
//                     }) 
//                   }
//                   else{
//                     console.log("there's stock but not adding like")
//                     res.json({stockData:{
//                       stock: stock.symbol,
//                       price: data.latestPrice,
//                       likes: stock.likes.length
//                     }})
//                   }
//                 }
//               })
//             }
//         })
//       }else{
//         console.log(stock)
//         const [stock1, stock2] = stock
//         console.log(stock1, stock2)
//         const obj1 = {}
//         const obj2 = {}

//         fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock1}/quote`)
//           .then(res => res.json())
//           .then(data => {
//             if(!data.symbol)
//               obj1
//           })

//         res.json({yo:"now there are multiple"})
        
//       }
        
//         // app.route('/api/stock-prices')
//         // .get(function (req, res){
          
//         // }
//     });
    
    
// };
