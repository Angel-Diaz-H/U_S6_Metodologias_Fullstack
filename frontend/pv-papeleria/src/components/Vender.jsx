import { useState, useEffect } from 'react';

const Vender = () => {
  const [productos, setProductos] = useState([]);
  const [venta, setVenta] = useState([]);
  const [montoPago, setMontoPago] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/productos/listar');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        alert('No se pudieron cargar los productos. Intenta más tarde.');
      }
    };
    fetchProductos();
  }, []);

  const agregarProducto = (producto) => {
    const existe = venta.find((p) => p.id_producto === producto.ID_PRODUCTO);
    if (existe) {
      existe.cantidad += 1;
    } else {
      setVenta([...venta, { ...producto, cantidad: 1 }]);
    }
  };

  const handleVenta = async () => {
    const productosParaEnviar = venta.map(p => ({
      id_producto: p.ID_PRODUCTO,
      cantidad: p.cantidad,
    }));

    try {
      const response = await fetch('http://localhost:3000/ventas/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productos: productosParaEnviar, montoPago }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Venta registrada. Cambio: ${data.cambio}`);
        setVenta([]);
        setMontoPago(0);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
    }
  };

  return (
    <div>
      <h2>Vender Productos</h2>
      <div>
        <h3>Seleccionar Productos</h3>
        {productos.map(producto => (
          <div key={producto.ID_PRODUCTO}>
            <span>{producto.NOMBRE} - ${producto.PRECIO}</span>
            <button onClick={() => agregarProducto(producto)}>Agregar</button>
          </div>
        ))}
      </div>

      <h3>Carrito</h3>
      {venta.map((p, index) => (
        <div key={index}>
          {p.NOMBRE} - ${p.PRECIO} x {p.cantidad}
        </div>
      ))}

      <h3>Monto de Pago</h3>
      <input type="number" value={montoPago} onChange={(e) => setMontoPago(parseFloat(e.target.value) || 0)} />

      <button onClick={handleVenta}>Finalizar Venta</button>
    </div>
  );
};

export default Vender;
