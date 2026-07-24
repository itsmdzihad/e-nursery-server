import express, { Application, ErrorRequestHandler } from "express";
import sendRes from "./App/utils/sendRes.js";
import cors from "cors";
import { prisma } from "./App/config/db.js";
import authRoute from "./App/modules/auth/auth.route.js";
import router from "./App/routes/index.js";

const app: Application = express();
const port = 3000;

//parsers
app.use(cors());
app.use(express.json());

const connect = async () => {
  try {
    await prisma.$connect();
    console.log("Database is connected");
  } catch (e) {
    console.log("Database connecting Fail");
  }
};

connect();

// product route
app.use("/api/v1", router);
// app.use("/api/v1/products", productRoutes);

app.get("/", (req, res) => {
  sendRes({
    res,
    success: true,
    statusCode: 200,
    message: "server is running",
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
