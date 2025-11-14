// components/client/DepartmentsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DepartmentsList.css"; // CSS opcional

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments");
        setDepartments(response.data); // Ajuste: response.data es directamente la lista
      } catch (err) {
        setError("Error al cargar departamentos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) return <div>Cargando departamentos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="departments-list">
      <h2>Departamentos del Hotel</h2>
      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="department-card">
            {" "}
            {/* Ajuste: usar id en lugar de _id */}
            {dept.images && dept.images.length > 0 && (
              <img
                src={dept.images[0].url}
                alt={dept.images[0].alt || dept.name}
                className="department-image"
              />
            )}
            <h3>{dept.name}</h3>
            <p>{dept.description}</p>
            <p>
              <strong>Jefe:</strong> {dept.head}
            </p>
            <p>
              <strong>Email:</strong> {dept.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {dept.phone}
            </p>
            <p>
              <strong>Estado:</strong> {dept.is_active ? "Activo" : "Inactivo"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DepartmentsList;
