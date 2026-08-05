import app from "./app.js";
import config from "./App/config/index.js";

async function main() {
  app.listen(config.PORT, () => {
    console.log(`server  is running on http://localhost:${config.PORT}`);
  });
}

main().catch((e) => console.log(e));
