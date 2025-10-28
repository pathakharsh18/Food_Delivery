import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Home.css";
import { Heart, Bookmark, MessageCircle, Home as HomeIcon } from "lucide-react";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [interaction, setInteraction] = useState({}); 
  const [showComment, setShowComment] = useState({}); 
  const [comments, setComments] = useState({}); 
  const [commentInputs, setCommentInputs] = useState({}); 
  const videoRefs = useRef([]);
  const commentInputRefs = useRef({}); 
  const navigate = useNavigate();

  // Fetch videos + saved info
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/food", { withCredentials: true });
        const allVideos = res.data.foodItems || [];
        setVideos(allVideos);

        const initInteraction = {};
        const initShowComment = {};
        const initComments = {};
        const initInputs = {};

        allVideos.forEach((v) => {
          initInteraction[v._id] = { liked: false, saved: false };
          initShowComment[v._id] = false;
          initComments[v._id] = [];
          initInputs[v._id] = "";
        });

        setInteraction(initInteraction);
        setShowComment(initShowComment);
        setComments(initComments);
        setCommentInputs(initInputs);

        // Fetch saved videos
        const savedRes = await axios.get("http://localhost:3000/api/food/saved", { withCredentials: true });
        const savedIds = savedRes.data.savedItems.map((item) => item._id);
        setInteraction((prev) => {
          const updated = { ...prev };
          savedIds.forEach((id) => {
            if (updated[id]) updated[id].saved = true;
          });
          return updated;
        });

        // Fetch comments for each video
        allVideos.forEach(async (v) => {
          try {
            const commentRes = await axios.get(`http://localhost:3000/api/food/${v._id}/comments`, {
              withCredentials: true,
            });
            setComments((prev) => ({ ...prev, [v._id]: commentRes.data || [] }));
          } catch (err) {
            console.error("Error fetching comments", err);
          }
        });
      } catch (err) {
        console.error("Error fetching videos:", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    fetchVideos();
  }, [navigate]);

  // Auto play/pause while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.8 }
    );
    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [videos]);

  // Like functionality
  const toggleLike = async (id) => {
    try {
      await axios.post("http://localhost:3000/api/food/like", { foodId: id }, { withCredentials: true });
      setInteraction((prev) => ({ ...prev, [id]: { ...prev[id], liked: !prev[id]?.liked } }));
    } catch (err) {
      console.error("Like error:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Save functionality
  const toggleSave = async (id) => {
    try {
      await axios.post("http://localhost:3000/api/food/save", { foodId: id }, { withCredentials: true });
      setInteraction((prev) => ({ ...prev, [id]: { ...prev[id], saved: !prev[id]?.saved } }));
    } catch (err) {
      console.error("Save error:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  };

  // Comment handling
  const toggleCommentBox = (id) => {
    setShowComment((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (updated[id]) {
        setTimeout(() => commentInputRefs.current[id]?.focus(), 0);
      }
      return updated;
    });
  };

  const handleCommentChange = (id, value) => setCommentInputs((prev) => ({ ...prev, [id]: value }));

  const addComment = async (id) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:3000/api/food/${id}/comments`,
        { text },
        { withCredentials: true }
      );

      setComments((prev) => ({
        ...prev,
        [id]: [res.data.comment, ...(prev[id] || [])], 
      }));

      setCommentInputs((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  // Navigation
  const goToHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSaved = () => {
    navigate("/saved-videos");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {videos.map((item, index) => (
        <section key={item._id} className="video-card">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={item.video}
            className="video-player"
            muted
            loop
            playsInline
          />

          <div className="overlay">
            <div className="right-icons">
              {/* Like */}
              <div
                className={`icon ${interaction[item._id]?.liked ? "active" : ""}`}
                onClick={() => toggleLike(item._id)}
              >
                <Heart />
                <span>{interaction[item._id]?.liked ? "Liked" : "Like"}</span>
              </div>

              {/* Comment */}
              <div className="icon" onClick={() => toggleCommentBox(item._id)}>
                <MessageCircle />
                <span>Comment ({comments[item._id]?.length || 0})</span>

                {showComment[item._id] && (
                  <div className="comment-box">
                    <div className="comments-list">
                      {comments[item._id]?.length === 0 ? (
                        <p className="no-comments">No comments yet</p>
                      ) : (
                        comments[item._id].map((c, i) => (
                          <p key={i} className="comment">
                            <strong>{c.username || "User"}:</strong> {c.text}
                          </p>
                        ))
                      )}
                    </div>
                    <div className="comment-input">
                      <input
                        ref={(el) => (commentInputRefs.current[item._id] = el)}
                        type="text"
                        placeholder="Add comment..."
                        value={commentInputs[item._id]}
                        onChange={(e) => handleCommentChange(item._id, e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addComment(item._id)}
                      />
                      <button onClick={() => addComment(item._id)}>Send</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save */}
              <div
                className={`icon ${interaction[item._id]?.saved ? "active" : ""}`}
                onClick={() => toggleSave(item._id)}
              >
                <Bookmark />
                <span>{interaction[item._id]?.saved ? "Saved" : "Save"}</span>
              </div>
            </div>

            <div className="bottom-left">
              <p className="desc">{item.description || "No description"}</p>
              <Link className="visit-btn" to={`/food-partner/${item.foodPartner}`}>
                Visit Store
              </Link>

              <div className="bottom-actions">
                <div className="nav-icon" onClick={goToHome}>
                  <HomeIcon />
                  <span>Home</span>
                </div>
                <div className="nav-icon" onClick={goToSaved}>
                  <Bookmark />
                  <span>Saved</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;

