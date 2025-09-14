const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

// Use CORS to allow requests from the React frontend
app.use(cors());

// Create a public directory to serve files from
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use("/uploads", express.static(uploadsDir));

// Store keyword to filename mapping
const keywordMap = {};
const keywords = [
  "nature",
  "travel",
  "technology",
  "art",
  "food",
  "music",
  "science",
  "sports",
  "fashion",
  "history",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload Endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Generate a random keyword and map it to the filename
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  keywordMap[randomKeyword] = req.file.originalname;

  console.log(`File uploaded: ${req.file.originalname}`);
  console.log(`Assigned keyword: ${randomKeyword}`);
  console.log("Current Keyword Map:", keywordMap);

  res.json({ keyword: randomKeyword });
});

// Download Endpoint
app.get("/download/:keyword", (req, res) => {
  const { keyword } = req.params;
  const filename = keywordMap[keyword];

  if (!filename) {
    return res.status(404).json({ message: "Keyword not found." });
  }

  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Could not download the file.");
      }
    });
  } else {
    res.status(404).json({ message: "File not found on server." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
