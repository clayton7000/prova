import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; 
import GerenciadorClientes from './GerenciadorClientes';
import TelaRelatorioCliente from './TelaRelatorioCliente';
import Login from './pages/Login'; 
import ProtectedRoute from './components/ProtectedRoute'; 

// Tela de início limpa e totalmente em branco
const Inicio = () => <div className="w-100 h-100"></div>;

const Sair = () => <div className="alert alert-warning shadow-sm">Sessão finalizada. Você saiu do sistema.</div>;

// Layout privado que sincroniza Sidebar, Navbar e Margens Dinâmicas
const LayoutPrivado = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-vh-100 bg-light d-flex overflow-hidden">
        
        {/* Nova Navbar fixa ocupando o topo total da tela */}
        <Navbar 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Sidebar com controle de colapso acionado por ela mesma */}
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} // Passado para o botão interno funcionar
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />

        {/* Conteúdo da Direita: Ajusta de forma fluida a largura e margem superior */}
        <div 
          className="d-flex flex-column min-vh-100 w-100"
          style={{
            marginLeft: isCollapsed ? '75px' : '280px', // Sincronizado com os tamanhos da nova Sidebar
            paddingTop: '70px', // Evita que o conteúdo suma para debaixo do Navbar fixo
            transition: 'margin-left 0.25s ease-in-out',
          }}
        >
          {/* Área Principal de Renderização das Telas */}
          <main className="flex-grow-1 p-3 p-md-4 p-lg-5 overflow-auto w-100">
            <div className="container-fluid" style={{ maxWidth: '1200px', marginLeft: '0' }}>
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* CSS Breakpoint: Zera as margens em telas menores (Mobile/Tablet) */}
      <style>{`
        @media (max-width: 991.98px) {
          .min-vh-100.w-100 { 
            margin-left: 0px !important; 
          }
        }
      `}</style>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Tela limpa, sem Sidebar nem Navbar) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Privadas (Protegidas e envelopadas pelo novo layout) */}
        <Route path="/" element={
          <LayoutPrivado>
            <Inicio />
          </LayoutPrivado>
        } />

        <Route path="/clientes" element={
          <LayoutPrivado>
            <GerenciadorClientes />
          </LayoutPrivado>
        } />

        <Route path="/relatorios/clientes" element={
          <LayoutPrivado>
            <TelaRelatorioCliente />
          </LayoutPrivado>
        } />

        <Route path="/sair" element={
          <LayoutPrivado>
            <Sair />
          </LayoutPrivado>
        } />

        {/* Redireciona qualquer rota inexistente ou antiga para a raiz do sistema */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}