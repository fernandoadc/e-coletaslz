import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CollectorAuth from './pages/CollectorAuth';
// import EstablishmentAuth from './pages/EstablishmentAuth'; // Crie este componente similar ao CollectorAuth

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coletor/auth" element={<CollectorAuth />} />
        {/* <Route path="/estabelecimento/auth" element={<EstablishmentAuth />} /> */}
        {/* Outras rotas do seu aplicativo */}
      </Routes>
    </Router>
  );
}

export default App;
