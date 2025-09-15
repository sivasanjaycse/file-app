import React, { useState, useRef } from "react";

export default function UploadSection({ onFileUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onFileUploaded(data.keyword);
        fileInputRef.current.value = "";
        setSelectedFile(null);
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("An error occurred during upload. Please check the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-card">
      <h2 className="section-title">1. Upload Your File</h2>
      <div className="input-group">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="upload-button"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {selectedFile && (
        <p className="selected-file-info">
          Selected file: <span className="file-name">{selectedFile.name}</span>
        </p>
      )}
    </div>
  );
}
