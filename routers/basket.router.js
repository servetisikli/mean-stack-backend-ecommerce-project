import express from "express";
import Basket from "../models/basket.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Get all basket items for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const basketItems = await Basket.find({ userId });
    res.json(basketItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add an item to the basket
router.post("/", async (req, res) => {
  try {
    const basketItem = new Basket(req.body);
    basketItem._id = uuidv4();
    await basketItem.save();
    res.status(201).json(basketItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an item in the basket
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Basket.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      res.status(404).json({ message: "Basket item not found!" });
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an item from the basket
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Basket.findByIdAndDelete(id);
    if (!deletedItem) {
      res.status(404).json({ message: "Basket item not found!" });
    } else {
      res.json({ message: "Basket item deleted successfully!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
