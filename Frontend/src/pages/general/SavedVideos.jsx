import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const SavedVideos = () => {
    const [videos, setVideos] = useState([]);
    const videoRefs = useRef([]);

    useEffect(() => {
        const fetchSavedVideos = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/food/saved", {
                    withCredentials: true
                });
                setVideos(res.data.savedItems);
            } catch (err) {
                console.error(" Error fetching saved videos:", err);
            }
        };
        fetchSavedVideos();
    }, []);

    // Auto play/pause when in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) video.play().catch(() => {});
                    else video.pause();
                });
            },
            { threshold: 0.8 }
        );

        videoRefs.current.forEach(v => v && observer.observe(v));
        return () => observer.disconnect();
    }, [videos]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Saved Videos</h2>
            {videos.length === 0 && <p>No saved videos yet!</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {videos.map((item, idx) => (
                    <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px" }}>
                        <video
                            ref={el => (videoRefs.current[idx] = el)}
                            src={item.video}
                            muted
                            loop
                            playsInline
                            style={{ width: "100%", maxHeight: "300px" }}
                        />
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedVideos;
