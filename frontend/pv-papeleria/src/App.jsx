import { useState } from 'react';
import Productos from './components/Productos';
import Vender from './components/Vender';

function App() {
  const [view, setView] = useState('productos');

  return (
    <div className="App">
      <h1>Punto de Venta - Papelería</h1>
      <button onClick={() => setView('productos')}>Productos</button>
      <button onClick={() => setView('vender')}>Vender</button>
      
      {view === 'productos' ? <Productos /> : <Vender />}
    </div>
  );
}

export default App;
