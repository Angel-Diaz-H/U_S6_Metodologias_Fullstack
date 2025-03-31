import './App.css'; // Importa los estilos aquí
import { useState } from 'react';
import Productos from './components/Productos';
import Vender from './components/Vender';
import Estadisticas from './components/Estadisticas';

function App() {
  const [view, setView] = useState('vender'); // Vista inicial

  return (
    <div className="app-container">
      {/* Menú lateral */}
      <aside className="sidebar">
        <h2>Punto de Venta</h2>
        <button onClick={() => setView('vender')}>Vender</button>
        <button onClick={() => setView('productos')}>Productos</button>
        <button onClick={() => setView('estadisticas')}>Estadísticas</button>
        <button>Usuarios</button>
        <button>Ayuda</button>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        {view === 'vender' && <Vender />}
        {view === 'productos' && <Productos />}
        {view === 'estadisticas' && <Estadisticas />}
      </main>
    </div>
  );
}

export default App;