import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  content: String,
  status: String,
  authorId: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Article", schema);