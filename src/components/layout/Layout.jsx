// src/components/layout/Layout.js (Sin cambios, ya está correcto)
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
