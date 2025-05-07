import express from "express";
import cors from "cors";
import path from "path";
import connection from "./database/db.js";
import authRouter from "./routers/auth.router.js";
import categoryRouter from "./routers/category.router.js";
import productRouter from "./routers/product.router.js";
import basketRouter from "./routers/basket.router.js";
import orderRouter from "./routers/order.router.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/baskets", basketRouter);
app.use("/api/orders", orderRouter);

connection();

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Application is running on http://localhost:${port}`)
);
