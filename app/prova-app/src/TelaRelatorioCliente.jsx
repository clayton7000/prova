import React, { useState, useEffect } from 'react';
import { api } from './services/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = '/api/clientes';

export default function TelaRelatorioCliente() {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  useEffect(() => {
    const buscarClientesParaCombo = async () => {
      try {
        setCarregandoClientes(true);
        const response = await api.get(API_URL);
        setClientes(response.data);
      } catch (error) {
        console.error('Erro ao carregar clientes para o combo:', error);
        alert('Erro ao carregar a lista de filtros de clientes ou sessão expirada.');
      } finally {
        setCarregandoClientes(false);
      }
    };

    buscarClientesParaCombo();
  }, []);

  const handleImprimirRelatorio = async () => {
    setGerandoPdf(true);
    try {
      const urlRelatorio = `${API_URL}/relatorio`;
      const params = clienteSelecionado ? { codigo: clienteSelecionado } : {};

      const response = await api.get(urlRelatorio, {
        params: params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const urlDoArquivo = window.URL.createObjectURL(blob);

      const linkDownload = document.createElement('a');
      linkDownload.href = urlDoArquivo;
      
      if (clienteSelecionado) {
        linkDownload.setAttribute('download', `relatorio_cliente_${clienteSelecionado}.pdf`);
      } else {
        linkDownload.setAttribute('download', 'relatorio_todos_clientes.pdf');
      }

      document.body.appendChild(linkDownload);
      linkDownload.click();
      document.body.removeChild(linkDownload);

      window.URL.revokeObjectURL(urlDoArquivo);
    } catch (error) {
      console.error('Erro ao baixar o relatório PDF:', error);
      alert('Falha ao gerar o relatório PDF. Verifique suas permissões.');
    } finally {
      setGerandoPdf(false);
    }
  };

  return (
    <div className="w-100 animate-fade-in">
      
      {/* Indicador de Caminho (Breadcrumb) */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb bg-transparent p-0 m-0 text-muted small">
          <li className="breadcrumb-item"><i className="bi bi-house-door-fill"></i></li>
          <li className="breadcrumb-item">Relatórios</li>
          <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">Relação de clientes</li>
        </ol>
      </nav>

      {/* Título da View */}
      <div className="mb-4">
        <h2 className="h4 text-dark fw-bold m-0">Relação de clientes</h2>
      </div>

      {/* ÁREA DE CONFIGURAÇÃO DO RELATÓRIO */}
      <div className="card p-3 border-secondary border-opacity-50 rounded-1 bg-white shadow-sm">
        <div className="row g-3 align-items-center">
          
          {/* Campo de Seleção do Cliente */}
          <div className="col-12 col-md-9">
            <div className="d-flex align-items-center gap-2">
              <label className="text-dark fw-semibold small m-0 text-nowrap">Cliente:</label>
              
              <select 
                className="form-select form-select-sm border-dark custom-classic-select rounded-0"
                value={clienteSelecionado}
                onChange={(e) => setClienteSelecionado(e.target.value)}
                disabled={carregandoClientes || gerandoPdf}
                style={{ height: '31px' }}
              >
                {carregandoClientes ? (
                  <option>Carregando lista de clientes...</option>
                ) : (
                  <>
                    <option value="">SELECIONE OU CONSULTE UMA OPÇÃO</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.codigo} value={cliente.codigo}>
                        {`${String(cliente.codigo).padStart(4, '0')}, ${cliente.nome.toUpperCase()}, ${cliente.cnpj}`}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Botão Imprimir no Padrão Clássico */}
          <div className="col-12 col-md-3 text-end">
            <button 
              type="button" 
              className="btn btn-white border-dark border-2 fw-bold text-dark btn-sm d-inline-flex align-items-center justify-content-center gap-1 px-3 shadow-sm rounded-1 w-100 w-md-auto"
              onClick={handleImprimirRelatorio}
              disabled={carregandoClientes || gerandoPdf}
              style={{ height: '31px' }}
            >
              <i className="bi bi-printer text-dark fw-bold"></i> 
              {gerandoPdf ? 'Gerando...' : 'Imprimir'}
            </button>
          </div>

        </div>
      </div>

      {/* Estilos customizados locais para manter a coerência estética */}
      <style>{`
        .custom-classic-select {
          font-size: 0.85rem !important;
          font-weight: 500;
          color: #212529;
          background-color: #fff;
        }
        .custom-classic-select option {
          font-family: monospace;
          font-size: 0.9rem;
        }
        .btn-white {
          background-color: #ffffff;
          transition: background-color 0.2s ease;
        }
        .btn-white:hover:not(:disabled) {
          background-color: #f8f9fa;
        }
      `}</style>

    </div>
  );
}