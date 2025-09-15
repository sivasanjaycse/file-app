import React, { useState, useRef } from "react";
import UploadSection from "./UploadSection";
import DownloadSection from "./DownloadSection";
import "./app.css";

// Main App Component
const App = () => {
  const [generatedKeyword, setGeneratedKeyword] = useState(null);

  const handleFileUploaded = (keyword) => {
    setGeneratedKeyword(keyword);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">File Manager</h1>
        <p className="subtitle">
          Upload a file and get a unique keyword to download it later.
        </p>
      </header>
      <main className="main-content">
        <UploadSection onFileUploaded={handleFileUploaded} />
        <DownloadSection uploadedKeyword={generatedKeyword} />
      </main>
    </div>
  );
};

export default App;
