import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout';
import Materials from './pages/Materials';
import GridDetail from './pages/GridDetail';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/depo" element={<GridDetail />} />
          <Route path="/urunler" element={<Materials />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
