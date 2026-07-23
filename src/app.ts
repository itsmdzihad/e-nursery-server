import express, { Application, ErrorRequestHandler } from "express";
import sendRes from "./App/utils/sendRes";
import cors from "cors";
import productRoutes from "./App/routes/product.route";

const app: Application = express();
const port = 3000;

//parsers
app.use(cors());
app.use(express.json());

// product route
app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  sendRes({
    res,
    success: true,
    statusCode: 200,
    message: "server is running",
    data: {},
  });
});

app.get("*", (req, res) => {
  sendRes({
    res,
    success: false,
    statusCode: 404,
    message: "Route Not Found",
    data: {},
  });
});

app.use(((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Something Went Wrong",
  });
}) as ErrorRequestHandler);

export default app;
