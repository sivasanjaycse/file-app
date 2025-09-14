import React, { useState, useRef } from "react";

// Include the Tailwind CSS script for styling
const styleScript = document.createElement("script");
styleScript.src = "https://cdn.tailwindcss.com";
document.head.appendChild(styleScript);

// All components are defined within this single file
const UploadSection = ({ onFileUploaded }) => {
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
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        1. Upload Your File
      </h2>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="flex-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-600 mt-2">
          Selected file:{" "}
          <span className="font-medium text-gray-800">{selectedFile.name}</span>
        </p>
      )}
    </div>
  );
};

const DownloadSection = ({ uploadedKeyword }) => {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!keyword) {
      alert("Please enter a keyword to download.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/download/${keyword}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = keyword; // The download attribute will use the keyword as a filename.
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const text = await response.json();
        alert(`Download failed: ${text.message}`);
      }
    } catch (error) {
      console.error("Error during file download:", error);
      alert("An error occurred during download. Please check the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        2. Download Your File
      </h2>
      {uploadedKeyword && (
        <div className="p-4 bg-green-50 rounded-lg text-green-700 font-semibold text-center text-lg animate-pulse-once">
          Your generated keyword is:{" "}
          <span className="text-green-900 font-extrabold">
            {uploadedKeyword}
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to download file"
          className="flex-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
        />
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Downloading..." : "Download File"}
        </button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [generatedKeyword, setGeneratedKeyword] = useState(null);

  const handleFileUploaded = (keyword) => {
    setGeneratedKeyword(keyword);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 font-sans antialiased">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tighter">
          File Manager
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Upload a file and get a unique keyword to download it later.
        </p>
      </header>
      <main className="w-full flex flex-col items-center space-y-8">
        <UploadSection onFileUploaded={handleFileUploaded} />
        <DownloadSection uploadedKeyword={generatedKeyword} />
      </main>
    </div>
  );
};

export default App;
