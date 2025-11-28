import mongoose from "mongoose";

mongoose.connect(process.env.DB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Error:", err);
    process.exit(1);
  });
