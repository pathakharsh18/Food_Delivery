import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserRegister from "../pages/auth/UserRegister";
import UserLogin from "../pages/auth/UserLogin";
import PartnerRegister from "../pages/auth/PartnerRegister";
import PartnerLogin from "../pages/auth/PartnerLogin";
import Home from "../pages/general/Home";
import CreateFood from "../pages/food-partner/CreateFood";
import Profile from "../pages/food-partner/Profile";

// New pages for saved videos
import SavedVideos from "../pages/general/SavedVideos";
import SavedVideoPlayer from "../pages/general/SavedVideoPlayer";


function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />

        {/* Partner Routes */}
        <Route path="/food-partner/register" element={<PartnerRegister />} />
        <Route path="/food-partner/login" element={<PartnerLogin />} />
        <Route path="/partner-login" element={<PartnerLogin />} />
        <Route path="/create-food" element={<CreateFood />} />

        {/* Profile */}
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/food-partner/:id" element={<Profile />} />

        {/* General Pages */}
        <Route path="/" element={<Home />} />                     {/* Home feed */}
        <Route path="/saved-videos" element={<SavedVideos />} />  {/* Saved videos grid */}
        <Route path="/saved-video/:id" element={<SavedVideoPlayer />} /> {/* Clicked saved video */}

        {/* Default Redirect */}
        <Route path="*" element={<UserLogin />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
