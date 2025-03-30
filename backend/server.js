// server.js
const express = require('express');
const connection = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

// Endpoint para registrar una venta
app.post('/venta', (req, res) => {
  const { productos, montoPago, cambio } = req.body;

  // Insertar venta en la tabla VENTAS
  const queryVenta = `INSERT INTO VENTAS (MONTOPAGO, CAMBIO) VALUES (${montoPago}, ${cambio})`;
  const requestVenta = new connection.Request();
  requestVenta.query(queryVenta, (err, rowCount) => {
    if (err) {
      console.error('Error al registrar venta:', err);
      return res.status(500).json({ message: 'Error al registrar venta' });
    }

    // Obtener el ID de la venta recién insertada
    const idVenta = rowCount;

    // Insertar detalles de la venta
    productos.forEach((producto) => {
      const queryDetalle = `INSERT INTO DETALLEVENTA (ID_PRODUCTO, ID_VENTA, PRECIOREGISTRADO, CANTIDAD) 
                            VALUES (${producto.idProducto}, ${idVenta}, ${producto.precioRegistrado}, ${producto.cantidad})`;
      const requestDetalle = new connection.Request();
      requestDetalle.query(queryDetalle, (err) => {
        if (err) {
          console.error('Error al registrar detalle venta:', err);
        }
      });
    });

    res.json({ message: 'Venta registrada con éxito' });
  });
});

// Endpoint para obtener productos
app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM PRODUCTOS';
  const request = new connection.Request();
  request.query(query, (err, rowCount, rows) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ message: 'Error al obtener productos' });
    }

    const productos = rows.map(row => {
      return {
        idProducto: row[0].value,
        nombre: row[1].value,
        descripcion: row[2].value,
        precio: row[3].value,
        cantidad: row[4].value,
      };
    });

    res.json(productos);
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
