import { useState, useEffect } from 'react';
import './Vender.css'; // Reutilizamos el estilo de Vender.css

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    id_categoria: '',
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/productos/listar');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

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
        ? `http://localhost:3000/productos/actualizar/${productoSeleccionado.ID_PRODUCTO}`
        : 'http://localhost:3000/productos/agregar';
      const method = modoEdicion ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert(modoEdicion ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');
        setForm({ nombre: '', descripcion: '', precio: '', cantidad: '', id_categoria: '' });
        setModoEdicion(false);
        setProductoSeleccionado(null);
        fetchProductos();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEditar = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado(producto);
    setForm({
      nombre: producto.NOMBRE,
      descripcion: producto.DESCRIPCION,
      precio: producto.PRECIO,
      cantidad: producto.CANTIDAD,
      id_categoria: producto.ID_CATEGORIA,
    });
  };

  const handleDesactivar = async (idProducto) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/desactivar/${idProducto}`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Producto desactivado con éxito');
        fetchProductos();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al desactivar producto:', error);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.NOMBRE.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="vender-container">
      <h1 className="vender-title">Gestión de Productos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="productos-form">
        <h3>{modoEdicion ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          required
        />
        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          name="cantidad"
          type="number"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={handleChange}
          required
        />
        <select
          name="id_categoria"
          value={form.id_categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.ID_CATEGORIA} value={categoria.ID_CATEGORIA}>
              {categoria.NOMBRE}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-agregar">
          {modoEdicion ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      {/* Tabla de productos */}
      <div className="productos-list">
        <h3>Lista de Productos</h3>
        <input
          type="text"
          className="busqueda-input"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <table className="carrito-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.ID_PRODUCTO}>
                <td>{producto.NOMBRE}</td>
                <td>{producto.DESCRIPCION}</td>
                <td>${producto.PRECIO}</td>
                <td>{producto.CANTIDAD}</td>
                <td>{producto.CATEGORIA}</td>
                <td>
                  <button
                    className="btn-accion"
                    onClick={() => handleEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-accion"
                    onClick={() => handleDesactivar(producto.ID_PRODUCTO)}
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

export default Productos;