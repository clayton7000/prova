import React from 'react';

export default function Navbar({ isMobileOpen, setIsMobileOpen }) {
  // Removido 'isCollapsed' e 'setIsCollapsed' dos parâmetros pois o botão foi deletado
  return (
    <nav className="d-flex align-items-center justify-content-between px-4 py-2 fixed-top w-100" 
         style={{ 
           height: '70px', 
           zIndex: 1040, // Garante que o Navbar fique por cima da Sidebar
           backgroundColor: '#002B5B', // Azul escuro do layout
           borderTop: '4px solid #000000', // Linha preta superior do layout
           boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
         }}>
      
      {/* LADO ESQUERDO: Toggle Mobile e Logo */}
      <div className="d-flex align-items-center gap-3">
        
        {/* Botão de Menu apenas para Mobile */}
        <button 
          className="btn border-0 shadow-sm d-lg-none"
          style={{ backgroundColor: '#ffcc00' }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <i className={`bi bi-${isMobileOpen ? 'x-lg' : 'list'} fs-5 text-dark`}></i>
        </button>

        {/* LOGO INSTITUCIONAL (Botão de minimizar desktop removido daqui) */}
        <div className="d-flex flex-column position-relative" style={{ paddingRight: '20px' }}>
          <span className="fw-bolder h2 m-0" 
                style={{ 
                  fontStyle: 'italic', 
                  color: '#ffcc00', 
                  fontFamily: 'sans-serif',
                  letterSpacing: '-1px',
                  lineHeight: '1'
                }}>
            Ágape
          </span>
          <small className="text-white text-uppercase" 
                 style={{ 
                   fontSize: '0.55rem', 
                   marginTop: '2px', 
                   fontWeight: '500', 
                   letterSpacing: '0.5px' 
                 }}>
            Sistemas e Tecnologia
          </small>
          
          {/* Linha vertical divisória discreta */}
          <div className="position-absolute end-0 top-0 bottom-0 m-auto" 
               style={{ width: '1px', height: '80%', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
        </div>
      </div>
    </nav>
  );
}