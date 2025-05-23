import mongoose from "mongoose";

const basketSchema = new mongoose.Schema({
  _id: String,
  productId: String,
  price: Number,
  quantity: Number,
  userId: String,
});

const Basket = mongoose.model("Basket", basketSchema);

export default Basket;
