import { useState, useEffect } from 'react';
import './Vender.css';

const Vender = () => {
  const [productos, setProductos] = useState([]);
  const [venta, setVenta] = useState([]);
  const [montoPago, setMontoPago] = useState('');
  const [total, setTotal] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/productos/listar');
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Productos actualizados:', data); // Log para verificar los datos
      setProductos(data); // Actualiza el estado con los productos más recientes
    } catch (error) {
      console.error('Error al obtener productos:', error);
      alert('No se pudieron cargar los productos. Intenta más tarde.');
    }
  };

  const agregarProducto = (producto) => {
    if (producto.CANTIDAD <= 0) {
      alert('Este producto no está disponible en inventario.');
      return;
    }
  
    const existe = venta.find((p) => p.ID_PRODUCTO === producto.ID_PRODUCTO);
    if (existe) {
      if (existe.cantidad >= producto.CANTIDAD) {
        alert('No puedes agregar más productos de los disponibles en inventario.');
        return;
      }
      const nuevaVenta = venta.map((p) =>
        p.ID_PRODUCTO === producto.ID_PRODUCTO
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
      setVenta(nuevaVenta);
    } else {
      setVenta([...venta, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (producto, cantidad) => {
    if (cantidad < 1 || cantidad > producto.CANTIDAD) {
      alert('Cantidad inválida.');
      return;
    }
    const nuevaVenta = venta.map((p) =>
      p.ID_PRODUCTO === producto.ID_PRODUCTO
        ? { ...p, cantidad: parseInt(cantidad, 10) }
        : p
    );
    setVenta(nuevaVenta);
  };

  const quitarProducto = (producto) => {
    const nuevaVenta = venta.map((p) =>
      p.ID_PRODUCTO === producto.ID_PRODUCTO
        ? { ...p, cantidad: p.cantidad - 1 }
        : p
    ).filter((p) => p.cantidad > 0); // Elimina productos con cantidad 0
    setVenta(nuevaVenta);
  };

  const calcularTotal = () => {
    const total = venta.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);
    setTotal(total.toFixed(2)); // Redondea a 2 decimales
  };

  useEffect(() => {
    calcularTotal();
  }, [venta]);

  const handleVenta = async () => {
    const productosParaEnviar = venta.map((p) => ({
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
        setMontoPago('');
        await fetchProductos(); // Refresca la lista de productos
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
    }
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.NOMBRE.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="vender-container">
      {/* Encabezado */}
      <header className="vender-header">
        <h1 className="vender-title">Vender Productos</h1>
        <div className="usuario-info">
          <span>Vendedor: Juan Pérez</span>
          <button className="btn-cambiar-usuario">Cambiar Usuario</button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="vender-content">
        {/* Lista de productos */} 
        <div className="productos-list">
          <h3>Seleccionar Productos</h3>
          <input
            type="text"
            className="busqueda-input"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="productos-scroll">
              {productosFiltrados.map((producto) => (
                  <div key={producto.ID_PRODUCTO} className="producto-item">
                      <div className="producto-info">
                          <span>{producto.NOMBRE}</span>
                          <div className="producto-precio-stock">
                              <span>Precio: ${producto.PRECIO}</span>
                              <span>Stock: {producto.CANTIDAD}</span>
                          </div>
                      </div>
                      <div className="producto-botones">
                          <button className="btn-agregar" onClick={() => agregarProducto(producto)}>
                              Agregar
                          </button>
                          <button className="btn-detalles" onClick={() => setProductoSeleccionado(producto)}>
                              Detalles
                          </button>
                      </div>
                  </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div className="carrito">
          <h3>Carrito</h3>
          {venta.length === 0 ? (
            <p className="carrito-vacio">El carrito está vacío</p>
          ) : (
            <table className="carrito-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {venta.map((p) => (
                  <tr key={p.ID_PRODUCTO}>
                    <td>{p.NOMBRE}</td>
                    <td>${p.PRECIO}</td>
                    <td>
                      <input
                        type="number"
                        className="cantidad-input"
                        value={p.cantidad}
                        onChange={(e) => actualizarCantidad(p, e.target.value)}
                      />
                    </td>
                    <td>${(p.PRECIO * p.cantidad).toFixed(2)}</td>
                    <td>
                      <button className="btn-accion" onClick={() => agregarProducto(p)}>+</button>
                      <button className="btn-accion" onClick={() => quitarProducto(p)}>-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    {/* Total */}
    <div className="total-container">
      <h3>Total: ${total}</h3>
      <h3>Monto de Pago</h3>
      <input
        type="number"
        className="monto-input"
        value={montoPago}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '' || Number(value) >= 0) {
            setMontoPago(value === '' ? '' : Number(value)); // Permitir vacío o convertir a número
          } else {
            alert('El monto de pago no puede ser negativo.');
          }
        }}
        placeholder="Ingrese el monto de pago"
      />
      <div className="botones-container">
        <button
          className="btn-finalizar"
          onClick={handleVenta}
          disabled={venta.length === 0 || !montoPago || montoPago < total} // Comparación correcta
        >
          Finalizar Venta
        </button>
        <button className="btn-limpiar" onClick={() => setVenta([])}>
          Limpiar Carrito
        </button>
      </div>
    </div>

      {/* Modal de detalles */}
      {productoSeleccionado && (
        <div className="modal">
          <div className="modal-content">
            <h3>Detalles del Producto</h3>
            <p><strong>Nombre:</strong> {productoSeleccionado.NOMBRE}</p>
            <p><strong>Descripción:</strong> {productoSeleccionado.DESCRIPCION}</p>
            <p><strong>Precio:</strong> ${productoSeleccionado.PRECIO}</p>
            <p><strong>Cantidad Disponible:</strong> {productoSeleccionado.CANTIDAD}</p>
            <p><strong>Categoría:</strong> {productoSeleccionado.CATEGORIA}</p>
            <button onClick={() => setProductoSeleccionado(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Pie de página */}
      <footer className="footer">
        <p>© 2025 Papelería Milán. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Vender;