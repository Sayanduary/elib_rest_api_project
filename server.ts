import app from "./src/app.ts";

import dotenv from "dotenv";
dotenv.config();
const startServer = () => {
   const port = process.env.PORT || 3004;

   app.listen(port, () => {
      console.log(`Listening on PORT ${port} `);
   });
};

startServer();
