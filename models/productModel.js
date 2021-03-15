const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: String,
      min: 0,
    },
    description: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
