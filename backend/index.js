const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // 이미지 파일 서빙할 경로 수정

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // 파일 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  },
});

const upload = multer({ storage });

// MongoDB 연결
mongoose
  .connect("mongodb://localhost:27017/animationDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connect Error", err));

// 애니메이션 스키마 및 모델
const animeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  episodes: { type: Number, required: true },
  image: { type: String }, // 이미지 경로 추가
  trailer: { type: String }, // 트레일러 URL
});

const Animation = mongoose.model("Animation", animeSchema);

// API EndPoint

// 1. Animation Add (이미지 업로드 포함)
app.post("/animations", upload.single("image"), async (req, res) => {
  try {
    const animation = new Animation({
      title: req.body.title,
      genre: req.body.genre,
      episodes: req.body.episodes,
      image: req.file ? req.file.path : null,
      trailer: req.body.trailer, // 트레일러 URL 추가
    });

    await animation.save();
    res.status(201).send({
      message: "이미지 등록 성공",
      imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error registering animation:", error); // 오류 메시지 출력
    res.status(500).send("서버 오류 발생");
  }
});

// 2. Animation List Search
app.get("/animations", async (req, res) => {
  try {
    const animations = await Animation.find();
    res.status(200).send(animations);
  } catch (error) {
    console.error("Error fetching animations:", error); // 오류 메시지 출력
    res.status(500).send(error);
  }
});

// 3. Animation About List Search
app.get("/animations/:id", async (req, res) => {
  try {
    const animation = await Animation.findById(req.params.id); // 수정: req.params.id
    if (!animation) return res.status(404).send("Animation Not Found Search");
    res.status(200).send(animation);
  } catch (error) {
    console.error("Error fetching animation:", error); // 오류 메시지 출력
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
    console.error("Error updating animation:", error); // 오류 메시지 출력
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

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
