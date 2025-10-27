import React, { useState } from "react";
import "../../styles/CreateFood.css"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateFood() {
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  // Handle video selection
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video || !name || !description) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("name", name);
    formData.append("description", description);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/food",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      navigate("/")
      alert("Food created successfully!");
      // Reset form
      setVideo(null);
      setName("");
      setDescription("");
      setPreview(null);
      navigate("/"); // redirect after creation
    } catch (err) {
      console.error(err);
      alert("Error creating food!");
    }
  };

  return (
    <div className="create-food-container">
      <h2>Create Food Item</h2>
      <form className="create-food-form" onSubmit={handleSubmit}>
        
        {/* Video Upload */}
        <label>Video</label>
        <label className="upload-button">
          <svg
            className="upload-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M10 16.5l6-4.5-6-4.5v9zM4 5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z"/>
          </svg>
          {video ? video.name : "Upload Video"}
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </label>

        {/* Video Preview */}
        {preview && (
          <video
            src={preview}
            controls
            style={{ marginTop: "10px", borderRadius: "10px", maxWidth: "100%" }}
          />
        )}

        {/* Name Input */}
        <label>Name</label>
        <input
          type="text"
          value={name}
          placeholder="Enter food name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Description Input */}
        <label>Description</label>
        <textarea
          value={description}
          placeholder="Enter food description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Create Food</button>
      </form>
    </div>
  );
}

export default CreateFood;
