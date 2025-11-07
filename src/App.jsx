// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Booking from "./pages/public/Booking";
import Contact from "./pages/public/Contact";
import Restaurant from "./pages/public/Restaurant";
import Rooms from "./pages/public/Rooms";
import Services from "./pages/public/Services";
import "./App.css";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomDetails from "./components/ui/RoomDetails";
import ImageFullView from "./components/ui/ImageFullView";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
          <Route
            path="/rooms/:roomId/image/:imageIndex"
            element={<ImageFullView />}
          />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Add admin routes if needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
