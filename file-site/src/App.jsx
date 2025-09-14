import React, { useState, useRef } from "react";
import UploadSection from "./UploadSection";
import DownloadSection from "./DownloadSection";
// Main App Component
const App = () => {
  const [generatedKeyword, setGeneratedKeyword] = useState(null);

  const handleFileUploaded = (keyword) => {
    setGeneratedKeyword(keyword);
  };

  return (
    <div>
      <header>
        <h1>File Manager</h1>
        <p>Upload a file and get a unique keyword to download it later.</p>
      </header>
      <main>
        <UploadSection onFileUploaded={handleFileUploaded} />
        <DownloadSection uploadedKeyword={generatedKeyword} />
      </main>
    </div>
  );
};

export default App;
