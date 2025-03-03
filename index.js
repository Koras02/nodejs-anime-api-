const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB 연결
mongoose
  .connect("mongodb://localhost:27017/animationDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connect Error", err));

// 애니메이션 스키마 및 모델
const animeSchema = new mongoose.Schema({
  title: String,
  genre: String,
  episodes: Number,
});

const Animation = mongoose.model("Animation", animeSchema);

// API EndPoint

// 1. Animation Add
app.post("/animations", async (req, res) => {
  try {
    const animation = new Animation(req.body);
    await animation.save();
    res.status(201).send(animation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 2. Animation List Search
app.get("/animations", async (req, res) => {
  try {
    const animation = await Animation.find();
    res.status(200).send(animation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3. Animation About List Search
app.get("/animations/:id", async (req, res) => {
  try {
    const animation = await Animation.findById(res.params.id);
    if (!animation) return res.status(404).send("Animation Not Found Search");
    res.status(200).send(animation);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 4. Animation Update
app.put("/animations/:id", async (req, res) => {
  try {
    const animation = await Animation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!animation) return res.status(404).send("Animation Not Found Search!");
    res.status(200).send(animation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// 5. Animation Delete
app.delete("/animations/:id", async (req, res) => {
  try {
    const animation = await Animation.findByIdAndDelete(req.params.id);
    if (!animation) {
      return res.status(404).send("Animation Not Found Search!");
    }
    res.status(200).send("Animation Delete!");
  } catch (error) {
    console.error("Error deleting animation:", error); // 오류 메시지 출력
    res.status(500).send(error);
  }
});

// search Start
app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
