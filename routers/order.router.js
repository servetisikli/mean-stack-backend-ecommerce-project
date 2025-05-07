import express from "express";
import { v4 as uuidv4 } from "uuid";
import Order from "../models/order.js";
import Basket from "../models/basket.js";
import response from "../services/response.service.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  response(res, async () => {
    const { userId } = req.body;
    const baskets = await Basket.find({ userId: userId });

    for (const basket of baskets) {
      const order = new Order({
        _id: uuidv4(),
        productId: basket.productId,
        price: basket.price,
        quantity: basket.quantity,
        userId: userId,
        createdDate: new Date(),
      });

      await order.save();
      await Basket.findOneAndRemove(basket._id);
    }

    res.json({ message: "Your order has been successfully created!" });
  });
});

router.post("/", async (req, res) => {
  response(res, async () => {
    const { userId } = req.body;
    const orders = await Order.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ]).sort({ createdDate: -1 });

    res.json(orders);
  });
});

export default router;
