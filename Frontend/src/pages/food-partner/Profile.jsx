import React, { useEffect, useState } from "react";
import "../../styles/Profile.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/food-partner/${id}`, { withCredentials: true })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems || []);
      });
  }, [id]);

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
          <img className="profile-avatar" src="https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171" alt="" />
        <div className="profile-name">{profile?.name}</div>
        <div className="profile-address">{profile?.address}</div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-title">Total Meals</div>
          <div className="stat-value">{profile?.totalMeals}</div>
        </div>
        <div className="stat-item">
          <div className="stat-title">Customer Served</div>
          <div className="stat-value">{profile?.customerServed}</div>
        </div>
      </div>

      {/* Videos Grid */}
      <section className="profile-grid" aria-label="Videos">
        {videos.length > 0 ? (
          videos.map((v, index) => (
            <div className="profile-grid-item" key={index}>
              <video
                className="profile-grid-video"
                src={v.video}
                muted
                loop
                autoPlay
                playsInline
                style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "10px" }}
              />
            </div>
          ))
        ) : (
          <p className="no-videos">No videos uploaded yet.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
