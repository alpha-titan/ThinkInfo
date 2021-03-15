const Product = require("../models/productModel");
const axios = require("axios");

module.exports = {
  getProducts: async (req, res) => {
    const data = await Product.aggregate([
      {$match:{isDeleted:{$ne:true}}}
    ]); // ? get all products which is not deleted
    res.status(200).json({ success: true, data });
  },
  addProducts: async (req, res) => {
    const product = new Product(req.body);
    const acknlg = await product.save();
    res.status(201).json({ success: true, message:"Product has been created" });
  },
  deleteProduct: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isDeleted : true});
    res.status(200).json({ success: true, message:"Product has been deleted" });
  },
  getOneProduct: async (req, res) => {
    const { id } = req.params; //? Getting the Id from params in req.
    const { query } = req; //? we pass query in URL which gets currency.
    // console.log(query);

    // ? Setting Default value of Currency

    let currency =
      query && Object.keys(query).length === 0 && query.constructor === Object
        ? "USD"
        : query.currency.toUpperCase();
    // console.log("currency", currency);

    //? Satisfying teh condition incremnet view by 1 after every product request
    const product = await Product.findByIdAndUpdate(
      { _id: id },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    //! NOTE:-  I tried to use mongoose methods for getting converted price but I didn't want to use axios or fetching in databse layer. 
    //! Not much diff in Latency

    // ? configuring axios
    const options = {
      method: "GET",
      url: "https://currency-exchange.p.rapidapi.com/exchange",
      params: { from: "USD", to: currency, q: "1.0" },
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY, //?  storing key in env for security purpose
        "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
      },
    };

    const { data } = await axios.request(options);
    console.log(data);
    const convertedPrice = (product.price * data).toFixed(2); //? fixing it to 2 decimals
    res.status(200).json({ success: true, data: { product, convertedPrice } });
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

    //? satisfying the given constraints (only product view > 0 and top 5 as default or custm limit)
    const topProducts = await Product.aggregate([
      { $match: { viewCount: { $gt: 0 } } },
      { $sort: { viewCount: -1 } },
      { $limit: parseInt(limit) },
    ]);
    res.status(200).json({ succcess: true, topProducts });
  },
};
