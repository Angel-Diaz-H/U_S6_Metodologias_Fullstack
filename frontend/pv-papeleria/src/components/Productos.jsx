import { useState } from 'react';

const Productos = () => {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    id_categoria: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/productos/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Producto agregado con éxito');
        setForm({ nombre: '', descripcion: '', precio: '', cantidad: '', id_categoria: '' });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar producto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg w-80">
      <h2 className="text-lg font-bold mb-4">Agregar Producto</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
      <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} required />
      <input name="cantidad" type="number" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required />
      <input name="id_categoria" type="number" placeholder="ID Categoría" value={form.id_categoria} onChange={handleChange} required />
      <button type="submit" className="bg-blue-500 text-white p-2 mt-4 rounded">Agregar Producto</button>
    </form>
  );
};

export default Productos;