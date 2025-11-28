import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import "./config/db.js";

app.listen(3000, ()=>{
  console.log("Server running");
});

