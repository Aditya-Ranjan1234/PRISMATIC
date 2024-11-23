import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/Uploader.css";

function Uploader() {
  const [files, setFiles] = useState([]);
  const [isBoxVisible, setBoxVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setBoxVisible(false);
  }, []);

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    if (files.length === 1) {
      setBoxVisible(true);
    }
    if (index === currentIndex) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const scrollImages = (direction) => {
    setCurrentIndex((prevIndex) => {
      if (direction === "right") {
        return (prevIndex + 1) % files.length;
      } else {
        return (prevIndex - 1 + files.length) % files.length;
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handlePromptChange = (e) => {
    setUserPrompt(e.target.value);
  };

const handleAnalyzeClick = async () => {
  if (files.length > 0) {
    const currentFile = files[currentIndex];
    const formData = new FormData();
    formData.append("file", currentFile);
    formData.append("context", userPrompt || "Analyze the image and provide feedback.");

    setLoading(true); 

    try {
      const response = await fetch("http://localhost:8000/analyze-image", {
        method: "POST",
        body: formData, 
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setImageDescription(data.description || "No description available.");
    } catch (error) {
      console.error("Error sending image to the server", error);
      setImageDescription("Failed to analyze the image.");
    } finally {
      setLoading(false); 
    }
  }
};

  return (
    <div className="Uploader">
      <h2 className="uploader-heading">Add Images:</h2>
      {files.length > 0 && <p>{files.length} files uploaded</p>}
      <div>
        {isBoxVisible && (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here ...</p>
            ) : (
              <p>Drag 'n' drop images here, or click to select them</p>
            )}
          </div>
        )}
        <div className="image-container">
          {files.length > 0 && (
            <div className="image-item main">
              <button
                className="arrow-button left"
                onClick={() => scrollImages("left")}
              >
                &#8249;
              </button>
              <img
                src={files[currentIndex].preview}
                alt={`file preview ${currentIndex}`}
                className="image-preview"
              />
              <button
                className="arrow-button right"
                onClick={() => scrollImages("right")}
              >
                &#8250;
              </button>
              <div className="image-description-container">
                <div className="prompt-text">
  {loading ? (
    <div className="loading-spinner"></div>
  ) : (
    imageDescription || "Image Description"
  )}
</div>
                <input
                  type="text"
                  value={userPrompt}
                  onChange={handlePromptChange}
                  placeholder="Type your prompt here"
                  className="user-input"
                />
                <button
                  onClick={() => removeFile(currentIndex)}
                  className="remove-button"
                >
                  &times;
                </button>
                <button onClick={handleAnalyzeClick} className="analyze-button">
                  Analyze Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Uploader;
