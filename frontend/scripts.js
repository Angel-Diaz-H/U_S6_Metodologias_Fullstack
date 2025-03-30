function registrarVenta() {
    const producto = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
  
    const productos = [{ idProducto: producto, cantidad: cantidad, precioRegistrado: precio }];
    
    const montoPago = cantidad * precio;
    const cambio = montoPago - (montoPago * 0.1); // Ejemplo de cálculo de cambio
  
    fetch('http://localhost:3000/venta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productos, montoPago, cambio }),
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(error => console.error('Error:', error));
  }
  
  function cargarProductos() {
    fetch('http://localhost:3000/productos')
      .then(response => response.json())
      .then(data => {
        const listaProductos = document.getElementById('productos-lista');
        data.forEach(producto => {
          const li = document.createElement('li');
          li.textContent = `${producto.nombre} - $${producto.precio}`;
          listaProductos.appendChild(li);
        });
      })
      .catch(error => console.error('Error:', error));
  }
  
  window.onload = cargarProductos;
  