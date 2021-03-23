const Product = require("../models/productModel");
const axios = require("axios");
const {db, pool} = require("../db");
module.exports = {
  getProducts: async (req, res) => {
    // const data = await Product.aggregate([
    //   { $match: { isDeleted: { $ne: true } } },
    // ]); // ? get all products which is not deleted
    const result = await db("select * from products where isDeleted = ?;", [0]);
    console.log(result);
    res.status(200).json({ success: true, result });
  },
  addProducts: async (req, res) => {
    //? Mongo
    // const product = new Product(req.body);
    // const acknlg = await product.save();
    //? SQL
    const columns = Object.keys(req.body).join();
    const values = Object.values(req.body).map(ele=>pool.escape(ele)).join();
    const query = `insert into products (id,${columns}) values (uuid(),${values});`;
    console.log(query);
    const product = await db(query);
    console.log(product);
    
    res.status(201)
      .json({ success: true, message: "Product has been created" });
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    //? Mongo
    // const product = await Product.findByIdAndUpdate(id, { isDeleted: true });

    //? MySql
    const query = 'update products set isDeleted = 1 where id = ? ';
    const product = await db(query,[id])
    console.log(product);
    if (!product.affectedRows)
      res.status(404).json({ success: false, message: "Product not found" });

    res
      .status(200)
      .json({ success: true, message: "Product has been deleted" });
  },
  getOneProduct: async (req, res) => {
    const { id } = req.params; //? Getting the Id from params in req.
    const { paramquery } = req; //? we pass query in URL which gets currency.
    // console.log(query);

    // ? Setting Default value of Currency

    // let currency =
    //   paramquery && Object.keys(paramquery).length === 0 && paramquery.constructor === Object
    //     ? "USD"
    //     : paramquery.currency.toUpperCase();
    // console.log("currency", currency);

    //? Satisfying teh condition incremnet view by 1 after every product request
    // const product = await Product.findByIdAndUpdate(
    //   { _id: id },
    //   { $inc: { viewCount: 1 } },
    //   { new: true }
    // );

    const query = 'select * from products where id = ?'
    const product = await db(query, [id]);
    console.log(product);
    //? check if procduct exits
    //! NOTE:-  I tried to use mongoose methods for getting converted price but I didn't want to use axios or fetching in databse layer.
    //! Not much diff in Latency

    const query1 = 'update products set viewCount = viewCount+1 where id = ?'
    const upProduct = await db(query1, [id]);
    console.log(upProduct);
    if(!upProduct.affectedRows) res.status(404).json({success:false, message:"Error"})

    // ? configuring axios
    // const options = {
    //   method: "GET",
    //   url: "https://currency-exchange.p.rapidapi.com/exchange",
    //   params: { from: "USD", to: currency, q: "1.0" },
    //   headers: {
    //     "x-rapidapi-key": process.env.RAPID_API_KEY, //?  storing key in env for security purpose
    //     "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
    //   },
    // };

    // const { data } = await axios.request(options);
    // console.log(data);
    // const convertedPrice = (product.price * data).toFixed(2); //? fixing it to 2 decimals
    res.status(200).json({ success: true, data: { upProduct } });
  },
  getTopProducts: async (req, res) => {
    const limitQuery = req.query; //? gettng custom limit params incase the client passes
    let limit =
      limitQuery &&
      Object.keys(limitQuery).length === 0 &&
      limitQuery.constructor === Object
        ? 5
        : limitQuery.limit; // ? setting default value as 5 in case no custom limit sent
    // console.log(limitQuery);
    //? SQL

    const query = 'select name, price, description from products where viewCount >= 1 and isDeleted = 0 limit ?'
    const topProducts = await db(query, [parseInt(limit)]);
    console.log(topProducts);

    //? Mongo
    //? satisfying the given constraints (only product view > 0 and top 5 as default or custm limit)
    // const topProducts = await Product.aggregate([
    //   { $match: { viewCount: { $gt: 0 } } },
    //   { $sort: { viewCount: -1 } },
    //   { $limit: parseInt(limit) },
    // ]);
    res.status(200).json({ succcess: true, topProducts });
  },
};
