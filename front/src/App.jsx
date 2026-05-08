import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AeronavesPage from './pages/AeronavesPage'
import AeronaveDetailPage from './pages/AeronaveDetailPage'
import EtapasPage from './pages/EtapasPage'
import PecasPage from './pages/PecasPage'
import TestesPage from './pages/TestesPage'
import FuncionariosPage from './pages/FuncionariosPage'
import RelatoriosPage from './pages/RelatoriosPage'
import UsuarioPage from './pages/UsuarioPage'

function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/aeronaves" element={<AeronavesPage />} />
            <Route path="/aeronaves/:codigo" element={<AeronaveDetailPage />} />
            <Route path="/etapas" element={<EtapasPage />} />
            <Route path="/pecas" element={<PecasPage />} />
            <Route path="/testes" element={<TestesPage />} />
            <Route path="/funcionarios" element={<FuncionariosPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/usuario" element={<UsuarioPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
