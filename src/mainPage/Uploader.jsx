import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/Uploader.css";

function Uploader() {
  const [files, setFiles] = useState([]);
  const [isBoxVisible, setBoxVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [imageDescription, setImageDescription] = useState("");

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

  const handleWheelScroll = (e) => {
    e.preventDefault();
    if (Math.abs(e.deltaY) > 0) {
      const reducedDelta = e.deltaY / 2;
      if (reducedDelta > 0) {
        scrollImages("right");
      } else {
        scrollImages("left");
      }
    }
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
      formData.append("image", currentFile);
      formData.append("prompt", userPrompt);

      try {
        const response = await fetch("http://localhost:11400/api/llama", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: currentFile.preview,
            prompt: userPrompt || "Analyze the image and provide feedback.",
          }),
        });
        const data = await response.json();
        setImageDescription(data.description || "No description available.");
      } catch (error) {
        console.error("Error sending image to the server", error);
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
        <div className="image-container" onWheel={handleWheelScroll}>
          {files.length > 0 && (
            <div className="image-item main">
              <img
                src={files[currentIndex].preview}
                alt={`file preview ${currentIndex}`}
                className="image-preview"
              />
              <div className="image-description-container">
                <div className="prompt-text">
                  {imageDescription || "Image Description"}
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
