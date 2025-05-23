import './App.css'; // Importa los estilos aquí
import { useState } from 'react';
import Productos from './components/Productos';
import Vender from './components/Vender';
import Estadisticas from './components/Estadisticas';
import Categorias from './components/Categorias'; // Importa el componente Categorias

function App() {
  const [view, setView] = useState('vender'); // Vista inicial

  return (
    <div className="app-container">
      {/* Menú lateral */}
      <aside className="sidebar">
        <h2>Punto de venta</h2>
        <button onClick={() => setView('vender')}>Vender</button>
        <button onClick={() => setView('productos')}>Productos</button>
        {/* <button onClick={() => setView('estadisticas')}>Estadísticas</button> */}
        <button onClick={() => setView('categorias')}>Categorías</button> {/* Botón para Categorías */}
        <button>Usuarios</button>
        <button>Ayuda</button>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {view === 'vender' && <Vender />}
        {view === 'productos' && <Productos />}
        {view === 'estadisticas' && <Estadisticas />}
        {view === 'categorias' && <Categorias />} {/* Renderiza Categorías */}
      </main>
    </div>
  );
}

export default App;