import app from "./src/app.ts";
import { config } from "./src/config/config.ts";
import dotenv from "dotenv";
dotenv.config();
const startServer = () => {
   const port = config.port || 3004;

   app.listen(port, () => {
      console.log(`Listening on PORT ${port} `);
   });
};

startServer();
