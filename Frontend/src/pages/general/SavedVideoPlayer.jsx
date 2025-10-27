import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/SavedVideoPlayer.css";

const SavedVideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/food/${id}`,
          { withCredentials: true }
        );
        setVideo(res.data.video);
      } catch (err) {
        console.error("Error fetching video:", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    fetchVideo();
  }, [id, navigate]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  if (!video) return <p style={{color:"#fff", textAlign:"center", marginTop:"50px"}}>Loading...</p>;

  return (
    <div className="player-container">
      <video
        ref={videoRef}
        src={video.video}
        className="full-video"
        controls
        autoPlay
      />
    </div>
  );
};

export default SavedVideoPlayer;
