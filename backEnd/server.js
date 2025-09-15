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
  "adventure", "galaxy", "ocean", "mountain", "forest", "desert", "island", "river", "sunrise", "sunset",
  "shadow", "light", "fire", "water", "earth", "air", "storm", "winter", "summer", "autumn",
  "spring", "magic", "mystery", "legend", "myth", "dream", "fantasy", "reality", "future", "past",
  "memory", "journey", "quest", "victory", "defeat", "challenge", "puzzle", "game", "story", "poem",
  "song", "dance", "painting", "ceg", "photo", "film", "theater", "architecture", "design", "style",
  "culture", "tradition", "festival", "ceremony", "community", "family", "friend", "love", "hate", "joy",
  "sadness", "anger", "fear", "courage", "hope", "peace", "chaos", "freedom", "justice", "power",
  "knowledge", "wisdom", "truth", "lie", "secret", "code", "algorithm", "network", "database", "server",
  "robot", "drone", "cyber", "virtual", "energy", "force", "speed", "sound", "silence", "echo",
  "whisper", "scream", "laugh", "cry", "smile", "frown", "emotion", "thought", "idea", "concept",
  "theory", "experiment", "discovery", "solution", "problem", "question", "answer", "language", "word", "symbol",
  "animal", "plant", "flower", "tree", "bird", "insect", "fish", "whale", "shark", "lion",
  "tiger", "wolf", "fox", "eagle", "dragon", "unicorn", "phoenix", "human", "alien", "monster",
  "hero", "villain", "king", "queen", "prince", "princess", "knight", "wizard", "witch", "warrior",
  "explorer", "pioneer", "rebel", "leader", "follower", "student", "teacher", "doctor", "artist", "writer",
  "engineer", "athlete", "chef", "pilot", "astronaut", "detective", "spy", "soldier", "captain", "pirate",
  "city", "village", "castle", "temple", "ruins", "bridge", "tower", "tunnel", "labyrinth", "maze",
  "market", "library", "school", "hospital", "factory", "office", "home", "garden", "park", "beach",
  "space", "planet", "star", "comet", "nebula", "cosmos", "universe", "dimension", "portal", "void",
  "destiny", "fate", "luck", "chance", "miracle", "curse", "blessing", "prophecy", "ritual", "omen",
  "gold", "silver", "crystal", "gem", "diamond", "ruby", "emerald", "sapphire", "metal", "stone",
  "wood", "glass", "paper", "cloth", "leather", "plastic", "computer", "phone", "camera", "clock",
  "watch", "key", "lock", "map", "compass", "ship", "boat", "car", "train", "plane",
  "rocket", "weapon", "shield", "armor", "sword", "bow", "arrow", "gun", "bomb", "potion",
  "virat", "scroll", "book", "journal", "letter", "message", "signal", "radio", "television", "internet"
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

// --- MODIFIED SECTION ---
// Upload Endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  // 1. Pick a keyword that is not already in the keywordMap
  const usedKeywords = Object.keys(keywordMap);
  const availableKeywords = keywords.filter((k) => !usedKeywords.includes(k));

  // Check if any keywords are available
  if (availableKeywords.length === 0) {
    return res.status(503).json({ message: "All keywords are currently in use. Please try again later." });
  }

  // Select a random keyword from the list of available ones
  const randomKeyword = availableKeywords[Math.floor(Math.random() * availableKeywords.length)];
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

// --- NEW SECTION ---
// Delete Endpoint
app.delete("/delete/:keyword", (req, res) => {
  const { keyword } = req.params;
  const filename = keywordMap[keyword];

  // 2. Check if the keyword exists in our map
  if (!filename) {
    return res.status(404).json({ message: "Keyword not found." });
  }

  const filePath = path.join(uploadsDir, filename);

  // First, remove the keyword from the map
  delete keywordMap[keyword];
  console.log(`Keyword '${keyword}' and its mapping removed.`);
  console.log("Current Keyword Map:", keywordMap);

  // Then, attempt to delete the file from the filesystem
  fs.unlink(filePath, (err) => {
    if (err) {
      // If the file doesn't exist, it's not a critical error for this operation.
      if (err.code === 'ENOENT') {
        console.log(`File '${filename}' was already deleted or not found.`);
        return res.status(200).json({ message: `Resource for keyword '${keyword}' deleted successfully.` });
      }
      // For other errors (like permissions), log it and inform the user.
      console.error(`Error deleting file '${filename}':`, err);
      return res.status(500).json({ message: `Mapping for keyword removed, but failed to delete the file from disk.` });
    }

    console.log(`File '${filename}' deleted successfully from disk.`);
    res.status(200).json({ message: `File associated with keyword '${keyword}' deleted successfully.` });
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});