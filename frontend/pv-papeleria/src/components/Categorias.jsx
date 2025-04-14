import { useState, useEffect } from 'react';
import './Vender.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch('http://localhost:3000/categorias/listar');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = modoEdicion
        ? `http://localhost:3000/categorias/actualizar/${categoriaSeleccionada.ID_CATEGORIA}`
        : 'http://localhost:3000/categorias/agregar';
      const method = modoEdicion ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert(modoEdicion ? 'Categoría actualizada con éxito' : 'Categoría agregada con éxito');
        setForm({ nombre: '' });
        setModoEdicion(false);
        setCategoriaSeleccionada(null);
        fetchCategorias();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleEditar = (categoria) => {
    setModoEdicion(true);
    setCategoriaSeleccionada(categoria);
    setForm({ nombre: categoria.NOMBRE });
  };

  const handleDesactivar = async (idCategoria) => {
    try {
      const response = await fetch(`http://localhost:3000/categorias/desactivar/${idCategoria}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Categoría desactivada con éxito');
        fetchCategorias();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al desactivar categoría:', error);
    }
  };

  return (
    <div className="vender-container">
      <h1 className="vender-title">Gestión de Categorías</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="productos-form">
        <h3>{modoEdicion ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-agregar">
          {modoEdicion ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      {/* Tabla de categorías */}
      <div className="productos-list">
        <h3>Lista de Categorías</h3>
        <table className="carrito-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.ID_CATEGORIA}>
                <td>{categoria.NOMBRE}</td>
                <td>
                  <button
                    className="btn-accion"
                    onClick={() => handleEditar(categoria)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-accion"
                    onClick={() => handleDesactivar(categoria.ID_CATEGORIA)}
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categorias;