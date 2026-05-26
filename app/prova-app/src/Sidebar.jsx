import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from './services/AuthService'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

// ADICIONADO: 'setIsCollapsed' agora entra nas props para podermos alterar o estado
export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openPedido, setOpenPedido] = useState(false);
  const [openRelatorio, setOpenRelatorio] = useState(false);

  const isActive = (path) => 
    location.pathname === path 
      ? 'text-white fw-semibold' 
      : 'text-secondary-custom';

  const handleLogout = (e) => {
    e.preventDefault(); 
    if (window.confirm("Deseja realmente sair do sistema?")) {
      AuthService.logout(); 
      setIsMobileOpen(false);
      navigate('/login'); 
    }
  };

  return (
    <>
      {/* Container Principal da Sidebar */}
      <div 
        className={`d-flex flex-column position-fixed top-0 bottom-0 start-0 z-3 shadow ${isMobileOpen ? 'd-flex' : 'd-none d-lg-flex'}`}
        style={{
          width: isCollapsed ? '75px' : '280px', // Reduz o tamanho caso esteja colapsado
          height: '100vh',
          backgroundColor: '#2b2b2b',
          transition: 'width 0.25s ease-in-out', // Transição suave ao ocultar/expandir
          overflowX: 'hidden',
          paddingTop: '70px' 
        }}
      >
        {/* Cabeçalho interno com o botão destacado na imagem */}
        <div className={`d-flex ${isCollapsed ? 'justify-content-center' : 'justify-content-end'} px-3 py-2 border-bottom-custom`}>
          <i 
            className="bi bi-list-task text-warning fs-4" 
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => setIsCollapsed(!isCollapsed)} // AÇÃO CLIQUE: Oculta / Minimiza a barra
            title={isCollapsed ? "Expandir menu" : "Ocultar menu"}
          ></i>
        </div>

        {/* Menu de Navegação */}
        <ul className="nav flex-column mb-auto w-100 overflow-y-auto custom-sidebar-scroll p-0 m-0">
          
          {/* Item: Início */}
          <li className="nav-item border-bottom-custom">
            <Link 
              to="/" 
              className={`nav-link d-flex align-items-center py-3 px-3 text-decoration-none custom-menu-item ${isActive('/')}`} 
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="custom-icon-wrapper me-3">
                <i className="bi bi-house-door-fill text-warning fs-5"></i>
              </div>
              {!isCollapsed && <span className="animate-fade">Início</span>}
            </Link>
          </li>

          {/* Item Dropdown: Cadastro */}
          <li className="nav-item border-bottom-custom">
            <button 
              className="nav-link d-flex align-items-center justify-content-between py-3 px-3 w-100 border-0 bg-transparent custom-menu-item text-start text-secondary-custom"
              onClick={() => !isCollapsed && setOpenCadastro(!openCadastro)}
            >
              <span className="d-flex align-items-center">
                <div className="custom-icon-wrapper me-3">
                  <i className="bi bi-caret-down-square-fill text-warning fs-5"></i>
                </div>
                {!isCollapsed && <span className="animate-fade">Cadastro</span>}
              </span>
              {!isCollapsed && (
                <i className={`bi bi-chevron-down text-warning fw-bold small transition-transform ${openCadastro ? 'rotate-180' : ''}`}></i>
              )}
            </button>
            
            {/* Submenu: Cadastro */}
            <div className={`collapse ${openCadastro && !isCollapsed ? 'show' : ''} bg-black bg-opacity-10`}>
              <ul className="list-unstyled fw-normal m-0 p-0">
                <li className="border-bottom-custom-sub">
                  <Link to="/clientes" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/clientes')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Cliente"}
                  </Link>
                </li>
                <li className="border-bottom-custom-sub">
                  <Link to="/produtos" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/produtos')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Produto"}
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Item Dropdown: Pedido */}
          <li className="nav-item border-bottom-custom">
            <button 
              className="nav-link d-flex align-items-center justify-content-between py-3 px-3 w-100 border-0 bg-transparent custom-menu-item text-start text-secondary-custom"
              onClick={() => !isCollapsed && setOpenPedido(!openPedido)}
            >
              <span className="d-flex align-items-center">
                <div className="custom-icon-wrapper me-3">
                  <i className="bi bi-caret-down-square-fill text-warning fs-5"></i>
                </div>
                {!isCollapsed && <span className="animate-fade">Pedido</span>}
              </span>
              {!isCollapsed && (
                <i className={`bi bi-chevron-down text-warning fw-bold small transition-transform ${openPedido ? 'rotate-180' : ''}`}></i>
              )}
            </button>
            
            {/* Submenu: Pedido */}
            <div className={`collapse ${openPedido && !isCollapsed ? 'show' : ''} bg-black bg-opacity-10`}>
              <ul className="list-unstyled fw-normal m-0 p-0">
                <li className="border-bottom-custom-sub">
                  <Link to="/pedidos" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/pedidos')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Pedido"}
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Item Dropdown: Relatórios */}
          <li className="nav-item border-bottom-custom">
            <button 
              className="nav-link d-flex align-items-center justify-content-between py-3 px-3 w-100 border-0 bg-transparent custom-menu-item text-start text-secondary-custom"
              onClick={() => !isCollapsed && setOpenRelatorio(!openRelatorio)}
            >
              <span className="d-flex align-items-center">
                <div className="custom-icon-wrapper me-3">
                  <i className="bi bi-caret-down-square-fill text-warning fs-5"></i>
                </div>
                {!isCollapsed && <span className="animate-fade">Relatório</span>}
              </span>
              {!isCollapsed && (
                <i className={`bi bi-chevron-down text-warning fw-bold small transition-transform ${openRelatorio ? 'rotate-180' : ''}`}></i>
              )}
            </button>
            
            {/* Submenu: Relatórios */}
            <div className={`collapse ${openRelatorio && !isCollapsed ? 'show' : ''} bg-black bg-opacity-10`}>
              <ul className="list-unstyled fw-normal m-0 p-0">
                <li className="border-bottom-custom-sub">
                  <Link to="/relatorios/clientes" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/relatorios/clientes')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Cliente"}
                  </Link>
                </li>
                <li className="border-bottom-custom-sub">
                  <Link to="/relatorios/produtos" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/relatorios/produtos')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Produto"}
                  </Link>
                </li>
                <li className="border-bottom-custom-sub">
                  <Link to="/relatorios/pedidos" className={`nav-link py-2.5 ps-5 custom-sub-item ${isActive('/relatorios/pedidos')}`} onClick={() => setIsMobileOpen(false)}>
                    {!isCollapsed && "Pedido"}
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Item: Sair */}
          <li className="nav-item border-bottom-custom">
            <button 
              className="nav-link d-flex align-items-center py-3 px-3 w-100 border-0 bg-transparent custom-menu-item text-start text-secondary-custom"
              onClick={handleLogout}
            >
              <div className="custom-icon-wrapper me-3">
                <i className="bi bi-caret-down-square-fill text-warning fs-5"></i>
              </div>
              {!isCollapsed && <span className="animate-fade">Sair</span>}
            </button>
          </li>

        </ul>
      </div>

      {/* Backdrop de fechamento para Mobile */}
      {isMobileOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 end-0 bottom-0 bg-black bg-opacity-50" 
          style={{ zIndex: 1035 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Estilos CSS específicos */}
      <style>{`
        .text-secondary-custom { color: #a0a0a0 !important; }
        .border-bottom-custom { border-bottom: 1.5px solid #3d3d3d !important; }
        .border-bottom-custom-sub { border-bottom: 1px solid #353535 !important; }
        .custom-icon-wrapper {
          width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-menu-item { font-size: 1.05rem; transition: background-color 0.2s ease; }
        .custom-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: #ffffff !important;
        }
        .custom-sub-item { font-size: 0.98rem; transition: all 0.2s ease; }
        .custom-sub-item:hover {
          background-color: rgba(255, 255, 255, 0.02);
          color: #ffffff !important;
          padding-left: 3.3rem !important;
        }
        .transition-transform { transition: transform 0.2s ease; }
        .rotate-180 { transform: rotate(180deg); }
        .animate-fade { animation: fadeInMenu 0.15s ease-in-out; }
        @keyframes fadeInMenu { from { opacity: 0; } to { opacity: 1; } }
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
      `}</style>
    </>
  );
}