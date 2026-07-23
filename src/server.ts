import app from "./app.js";
import { DB_URL, PORT } from "./App/config/index.js";

async function main() {
  app.listen(PORT, () => {
    console.log(`server  is running on http://localhost:${PORT}`);
  });
}

main().catch((e) => console.log(e));
