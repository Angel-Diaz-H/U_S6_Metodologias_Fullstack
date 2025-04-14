import { poolPromise } from '../db.js';

export const registrarVenta = async (req, res) => {
  const { productos, montoPago } = req.body;

  if (!productos || productos.length === 0 || !montoPago) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const pool = await poolPromise;

    // Calcular el total
    let totalVenta = 0;
    for (const producto of productos) {
      const result = await pool.request()
        .input('id_producto', producto.id_producto)
        .query('SELECT PRECIO FROM BDPVPAPELERIA.dbo.PRODUCTOS WHERE ID_PRODUCTO = @id_producto');
      const precio = result.recordset[0]?.PRECIO || 0;
      totalVenta += precio * producto.cantidad;
    }

    if (montoPago < totalVenta) {
      return res.status(400).json({ error: 'El monto de pago es insuficiente' });
    }
    const cambio = montoPago - totalVenta;

    // Registrar la venta
    const ventaResult = await pool.request()
      .input('montoPago', totalVenta)
      .input('cambio', cambio)
      .query('INSERT INTO BDPVPAPELERIA.dbo.VENTAS (MONTOPAGO, CAMBIO) OUTPUT INSERTED.ID_VENTA VALUES (@montoPago, @cambio)');
    const idVenta = ventaResult.recordset[0].ID_VENTA;

    // Registrar el detalle de la venta
    for (const producto of productos) {
      const result = await pool.request()
        .input('id_producto', producto.id_producto)
        .query('SELECT PRECIO FROM BDPVPAPELERIA.dbo.PRODUCTOS WHERE ID_PRODUCTO = @id_producto');
      const precio = result.recordset[0]?.PRECIO;

      await pool.request()
        .input('id_producto', producto.id_producto)
        .input('id_venta', idVenta)
        .input('precioRegistrado', precio)
        .input('cantidad', producto.cantidad)
        .query(`
          INSERT INTO BDPVPAPELERIA.dbo.DETALLEVENTA (ID_PRODUCTO, ID_VENTA, PRECIOREGISTRADO, CANTIDAD)
          VALUES (@id_producto, @id_venta, @precioRegistrado, @cantidad)
        `);
    }

    // Actualizar la cantidad de productos
    for (const producto of productos) {
      const result = await pool.request()
        .input('id_producto', producto.id_producto)
        .query('SELECT CANTIDAD FROM BDPVPAPELERIA.dbo.PRODUCTOS WHERE ID_PRODUCTO = @id_producto');
      const cantidadActual = result.recordset[0]?.CANTIDAD;

      if (cantidadActual !== undefined) {
        const nuevaCantidad = cantidadActual - producto.cantidad;
        await pool.request()
          .input('id_producto', producto.id_producto)
          .input('nuevaCantidad', nuevaCantidad)
          .query('UPDATE BDPVPAPELERIA.dbo.PRODUCTOS SET CANTIDAD = @nuevaCantidad WHERE ID_PRODUCTO = @id_producto');
      }
    }

    res.status(201).json({ message: 'Venta registrada con éxito', cambio });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    res.status(500).json({ error: error.message });
  }
};
