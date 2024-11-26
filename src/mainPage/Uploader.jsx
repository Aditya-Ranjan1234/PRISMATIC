import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../styles/Uploader.css";

function Uploader() {
  const [files, setFiles] = useState([]);
  const [isBoxVisible, setBoxVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageDescriptions, setImageDescriptions] = useState({});
  const [trackableInfo, setTrackableInfo] = useState({});
  const [caption, setCaption] = useState("");
  const [genre, setGenre] = useState("");
  const [currentDescriptionPage, setCurrentDescriptionPage] =
    useState("image_description");
  const BASE_API_URL =
    "https://33f7-2401-4900-65cf-ef8b-7c82-6b36-5ae7-536f.ngrok-free.app";

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

  const handleUploadClick = async () => {
    if (files.length > 0) {
      const currentFile = files[currentIndex];
      const formData = new FormData();
      formData.append("file", currentFile);

      setLoading(true);

      try {
        const uploadResponse = await fetch(`${BASE_API_URL}/upload-image`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Upload Error: ${uploadResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnalyzeClick = async () => {
    if (files.length > 0) {
      setLoading(true);

      try {
        const analyzeResponse = await fetch(`${BASE_API_URL}/analyze-image`, {
          method: "GET",
          headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
          }),
        });

        if (!analyzeResponse.ok) {
          throw new Error(`Analyze Error: ${analyzeResponse.statusText}`);
        }

        const analysisData = await analyzeResponse.json();
        setImageDescriptions((prevDescriptions) => ({
          ...prevDescriptions,
          [currentIndex]:
            analysisData.image_description || "No description available.",
        }));
        setTrackableInfo((prevTrackable) => ({
          ...prevTrackable,
          [currentIndex]:
            analysisData.trackable || "No trackable info available.",
        }));
      } catch (error) {
        console.error("Error analyzing image:", error);
        setImageDescriptions((prevDescriptions) => ({
          ...prevDescriptions,
          [currentIndex]: "Failed to analyze the image.",
        }));
        setTrackableInfo((prevTrackable) => ({
          ...prevTrackable,
          [currentIndex]: "Failed to retrieve trackable info.",
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenerateCaptionClick = async () => {
    if (files.length > 0) {
      const currentFile = files[currentIndex];
      try {
        const captionResponse = await fetch(
          `${BASE_API_URL}/generate-caption-genre`,
          {
            method: "POST",
            body: JSON.stringify({ context: userPrompt }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!captionResponse.ok) {
          throw new Error(
            `Caption Generation Error: ${captionResponse.statusText}`
          );
        }
        const captionData = await captionResponse.json();
        setCaption(captionData.Caption || "No caption available.");
        setGenre(captionData.genre || "Unknown");
      } catch (error) {
        console.error("Error generating caption:", error);
      }
    }
  };

  const getDescriptionForCurrentPage = () => {
    if (currentDescriptionPage === "image_description") {
      return (
        imageDescriptions[currentIndex] || "Image Description not available."
      );
    } else if (currentDescriptionPage === "trackable") {
      return trackableInfo[currentIndex] || "Trackable info not available.";
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
                <div className="description-content">
                  <p>
                    {loading ? "Loading..." : getDescriptionForCurrentPage()}
                  </p>
                  <button
                    className="toggle-description-button"
                    onClick={() =>
                      setCurrentDescriptionPage((prevPage) =>
                        prevPage === "image_description"
                          ? "trackable"
                          : "image_description"
                      )
                    }
                  >
                    {currentDescriptionPage === "image_description"
                      ? "Next ➡️"
                      : "⬅️ Back"}
                  </button>
                </div>
                <div className="button-container">
                  <button onClick={handleUploadClick} className="upload-button">
                    Upload
                  </button>
                  <button
                    onClick={handleAnalyzeClick}
                    className="analyze-button"
                  >
                    Analyze
                  </button>
                </div>
                <div className="prompt-input">
                  <input
                    type="text"
                    value={userPrompt}
                    onChange={handlePromptChange}
                    placeholder="Type your prompt here"
                    className="user-input"
                  />
                  <button
                    onClick={handleGenerateCaptionClick}
                    className="generate-caption-button"
                  >
                    Generate Caption
                  </button>
                </div>
                <div className="caption-container">
                  <input
                    type="text"
                    value={caption}
                    placeholder="Generated Caption"
                    className="caption-input"
                    readOnly
                    onClick={() => {
                      if (caption) {
                        navigator.clipboard
                          .writeText(caption)
                          .then(() => {
                            alert("Caption copied to clipboard!");
                          })
                          .catch((err) => {
                            console.error("Failed to copy caption:", err);
                          });
                      } else {
                        alert("No caption available to copy!");
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={genre}
                    placeholder="Genre"
                    className="genre-input"
                    readOnly
                  />
                </div>

                <button
                  onClick={() => removeFile(currentIndex)}
                  className="remove-button"
                >
                  &times;
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
