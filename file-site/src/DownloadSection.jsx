import React, { useState, useRef } from "react";
export default function DownloadSection({ uploadedKeyword }) {
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
    <div>
      <h2>2. Download Your File</h2>
      {uploadedKeyword && (
        <div>
          Your generated keyword is:{" "}
          <span className="text-green-900 font-extrabold">
            {uploadedKeyword}
          </span>
        </div>
      )}
      <div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to download file"
        />
        <button onClick={handleDownload} disabled={isLoading}>
          {isLoading ? "Downloading..." : "Download File"}
        </button>
      </div>
    </div>
  );
}
