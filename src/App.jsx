// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; // Ajusta la ruta si es necesario
import Layout from "./components/layout/Layout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Booking from "./pages/public/Booking";
import Contact from "./pages/public/Contact";
// import Restaurant from "./pages/public/Restaurant";
import Rooms from "./pages/public/Rooms";
import Services from "./pages/public/Services";
import "./App.css";
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoomDetails from "./components/ui/RoomDetails";
import ImageFullView from "./components/ui/ImageFullView";
import FullGallery from "./components/ui/FullGallery";
import ApartmentsList from "./components/ui/ApartmentsList";
import MenuView from "./components/sections/MenuView";
import SubmitTestimonial from "./pages/public/SubmitTestimonial";
import PropertyDetails from "./components/ui/PropertyDetails";
import UserLogin from "./pages/public/UserLogin";
import Terms from "./pages/public/Terms";
import Privacy from "./pages/public/Privacy";

const ProtectedAdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login-dd-hotel" replace />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/restaurant" element={<Restaurant />} /> */}
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
          <Route path="/departments" element={<ApartmentsList />} />
          <Route path="/rooms/:tab" element={<Rooms />} />
          <Route
            path="/rooms/:roomId/image/:imageIndex"
            element={<ImageFullView />}
          />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Register />} />
          <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin/login-dd-hotel" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/full-gallery/" element={<FullGallery />} />
          <Route path="/apartments/:id" element={<PropertyDetails />} />
          <Route path="/terms" element={<Terms />} /> {/* Nueva */}
          <Route path="/privacy" element={<Privacy />} /> {/* Nueva */}
          {/* Add admin routes if needed */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
