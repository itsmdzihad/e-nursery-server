import { connect } from "mongoose";
import app from "./app";
import { DB_URL, PORT } from "./App/config";

async function main() {
  await connect(DB_URL);
  console.log("DATABASE IS CONNECTED");
  app.listen(PORT, () => {
    console.log(`server  is running on http://localhost:${PORT}`);
  });
}

main().catch((e) => console.log(e));
