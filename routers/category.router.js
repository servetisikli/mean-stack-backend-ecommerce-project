import express from "express";
import Category from "../models/category.js";
import { v4 as uuidv4 } from "uuid";
import response from "../services/response.service.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  response(res, async () => {
    const { name } = req.body;

    const checkName = await Category.findOne({ name: name });
    if (checkName != null) {
      res
        .status(403)
        .json({ message: "This category name is already in use!" });
    } else {
      const category = new Category({
        _id: uuidv4(),
        name: name,
      });

      await category.save();
      res.json({ message: "Category successfully added!" });
    }
  });
});

router.post("/removeById", async (req, res) => {
  response(res, async () => {
    const { _id } = req.body;
    await Category.findByIdAndRemove(_id);
    res.json({ message: "Category successfully deleted!" });
  });
});

router.post("/update", async (req, res) => {
  response(res, async () => {
    const { _id, name } = req.body;
    const category = await Category.findOne({ _id: _id });

    if (category.name !== name) {
      const checkName = await Category.findOne({ name: name });
      if (checkName != null) {
        res
          .status(403)
          .json({ message: "This category name is already in use!" });
      } else {
        category.name = name;
        await Category.findByIdAndUpdate(_id, category);
        res.json({ message: "Category successfully updated!" });
      }
    }
  });
});

router.get("/", async (req, res) => {
  response(res, async () => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  });
});

export default router;
