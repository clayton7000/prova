import React, { useState, useEffect } from 'react';
import { api } from './services/AuthService';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = '/api/clientes';

export default function GerenciadorClientes() {
  const [clientes, setClientes] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');      

  // Estados dos filtros superiores
  const [filtroCodigo, setFiltroCodigo] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroCnpj, setFiltroCnpj] = useState('');

  // 🌟 ESTADO DE ORDENAÇÃO (Inicia sem ordenação ou pode definir um padrão)
  const [sortConfig, setSortConfig] = useState({ campo: null, direcao: 'asc' });

  // ESTADOS DA PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10; 

  const [clienteAtual, setClienteAtual] = useState({
    codigo: '', nome: '', cnpj: '', rg: '', nascimento: '',
    endereco: '', complemento: '', bairro: '', cep: '',
    cidade: '', uf: '', telefone: '', celular: '', observacao: ''
  });

  const [editando, setEditando] = useState(false);

  useEffect(() => {
    buscarClientes();
  }, []);

  // Toda vez que o usuário digitar algo nos filtros, resetamos para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroCodigo, filtroCliente, filtroCnpj]);

  const buscarClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_URL);
      setClientes(response.data); 
      setError('');
    } catch (err) {
      setError('Erro ao conectar com a API ou sessão expirada. Refaça o login se o problema persistir.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteAtual({ ...clienteAtual, [name]: value });
  };

  const handleEditarClick = (cliente) => {
    setEditando(true);
    setClienteAtual({ ...cliente }); 
  };

  const handleNovoClienteClick = () => {
    setEditando(false);
    setClienteAtual({
      codigo: '', nome: '', cnpj: '', rg: '', nascimento: '',
      endereco: '', complemento: '', bairro: '', cep: '',
      cidade: '', uf: '', telefone: '', celular: '', observacao: ''
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`${API_URL}/${clienteAtual.codigo}`, clienteAtual);
        alert('Cliente atualizado com sucesso!');
      } else {
        await api.post(API_URL, clienteAtual);
        alert('Cliente cadastrado com sucesso!');
      }
      buscarClientes(); 
      const modalElement = document.getElementById('clienteModal');
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    } catch (err) {
      alert('Erro ao salvar dados.');
      console.error(err);
    }
  };

  const handleExcluir = async (codigo) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente código ${codigo}?`)) {
      try {
        await api.delete(`${API_URL}/${codigo}`);
        alert('Cliente excluído com sucesso!');
        buscarClientes(); 
      } catch (err) {
        alert('Erro ao excluir o cliente.');
        console.error(err);
      }
    }
  };

  const limparFiltros = () => {
    setFiltroCodigo('');
    setFiltroCliente('');
    setFiltroCnpj('');
    setSortConfig({ campo: null, direcao: 'asc' }); // Opcional: limpa a ordenação também
  };

  // 🌟 FUNÇÃO QUE GERENCIA A SOLICITAÇÃO DE ORDENAÇÃO COORDENADA
  const solicitarOrdenacao = (campo) => {
    let direcao = 'asc';
    if (sortConfig.campo === campo && sortConfig.direcao === 'asc') {
      direcao = 'desc';
    }
    setSortConfig({ campo, direcao });
  };

  // 1. Aplica a filtragem baseada nos inputs superiores
  const clientesFiltrados = clientes.filter(cliente => {
    return (
      String(cliente.codigo || '').toLowerCase().includes(filtroCodigo.toLowerCase()) &&
      String(cliente.nome || '').toLowerCase().includes(filtroCliente.toLowerCase()) &&
      String(cliente.cnpj || '').toLowerCase().includes(filtroCnpj.toLowerCase())
    );
  });

  // 🌟 2. APLICA A ORDENAÇÃO DINÂMICA (Crescente / Decrescente)
  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    if (!sortConfig.campo) return 0; // Se nenhuma coluna foi clicada, mantém a ordem original de retorno da API

    let valorA = a[sortConfig.campo];
    let valorB = b[sortConfig.campo];

    // Tratamento especial para o Código (para ordenar de forma numérica e não textual)
    if (sortConfig.campo === 'codigo') {
      return sortConfig.direcao === 'asc' 
        ? Number(valorA) - Number(valorB) 
        : Number(valorB) - Number(valorA);
    }

    // Tratamento padrão para strings alfanuméricas (Nome e CNPJ)
    valorA = String(valorA || '').toLowerCase();
    valorB = String(valorB || '').toLowerCase();

    if (valorA < valorB) {
      return sortConfig.direcao === 'asc' ? -1 : 1;
    }
    if (valorA > valorB) {
      return sortConfig.direcao === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // 3. LÓGICA DE PAGINAÇÃO MATEMÁTICA (Agora utiliza a lista já devidamente ordenada)
  const totalPaginas = Math.ceil(clientesOrdenados.length / itensPorPagina) || 1;
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const clientesPaginados = clientesOrdenados.slice(indicePrimeiroItem, indiceUltimoItem);

  const irParaPrimeiraPagina = () => setPaginaAtual(1);
  const irParaUltimaPagina = () => setPaginaAtual(totalPaginas);
  const voltarPagina = () => setPaginaAtual(prev => Math.max(prev - 1, 1));
  const avancarPagina = () => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas));

  // Função auxiliar para renderizar o ícone de seta de ordenação na tabela
  const renderSetasOrdenacao = (campo) => {
    if (sortConfig.campo !== campo) {
      return <i className="bi bi-arrow-down-up text-muted ms-1 opacity-50" style={{ fontSize: '0.75rem' }}></i>;
    }
    return sortConfig.direcao === 'asc' 
      ? <i className="bi bi-sort-down text-dark ms-1 fw-bold"></i> 
      : <i className="bi bi-sort-up-alt text-dark ms-1 fw-bold"></i>;
  };

  return (
    <div className="w-100 animate-fade-in">
      
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb bg-transparent p-0 m-0 text-muted small">
          <li className="breadcrumb-item"><i className="bi bi-house-door-fill"></i></li>
          <li className="breadcrumb-item">Cadastro</li>
          <li className="breadcrumb-item active text-dark fw-medium" aria-current="page">Cliente</li>
        </ol>
      </nav>

      {/* Título */}
      <div className="mb-2">
        <h2 className="h4 text-dark fw-bold m-0">Cliente</h2>
        <small className="text-muted">Cadastrar, consultar, alterar e excluir um cliente</small>
      </div>

      {/* FILTROS */}
      <div className="card p-2 border-secondary border-opacity-50 rounded-1 bg-light shadow-sm mb-3">
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <button 
              className="btn btn-white border-dark border-2 fw-bold text-dark d-flex align-items-center gap-1 btn-sm px-3 shadow-sm rounded-1"
              data-bs-toggle="modal" data-bs-target="#clienteModal" onClick={handleNovoClienteClick}
            >
              <i className="bi bi-plus-circle-fill"></i> Novo
            </button>
          </div>
          <div className="col-auto text-muted px-2 d-none d-md-block">|</div>
          <div className="col-auto d-none d-md-block">
            <small className="text-muted fw-semibold">Filtrar por:</small>
          </div>
          <div className="col-6 col-sm-2 col-md-1">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted ps-2 pe-1" style={{ fontSize: '0.75rem' }}>Código:</span>
              <input type="text" className="form-control border-start-0 ps-1" value={filtroCodigo} onChange={(e) => setFiltroCodigo(e.target.value)} />
            </div>
          </div>
          <div className="col-12 col-sm-4 col-md-3">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted ps-2 pe-1" style={{ fontSize: '0.75rem' }}>Cliente:</span>
              <input type="text" className="form-control border-start-0 ps-1" value={filtroCliente} onChange={(e) => setFiltroCliente(e.target.value)} />
            </div>
          </div>
          <div className="col-12 col-sm-4 col-md-2">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0 text-muted ps-2 pe-1" style={{ fontSize: '0.75rem' }}>CNPJ:</span>
              <input type="text" className="form-control border-start-0 ps-1" value={filtroCnpj} onChange={(e) => setFiltroCnpj(e.target.value)} />
            </div>
          </div>
          <div className="col-auto d-flex align-items-center gap-2 ms-auto">
            <i className="bi bi-search text-dark fs-5 cursor-pointer" title="Pesquisar"></i>
            <i className="bi bi-slash-circle text-danger fs-5 cursor-pointer" onClick={limparFiltros} title="Limpar Filtros"></i>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger p-2 small">{error}</div>}

      {/* TABELA COM COMPORTAMENTO DE ORDENAÇÃO ADICIONADO NAS TH */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-2 text-muted small">Carregando...</p>
        </div>
      ) : (
        <div className="card shadow-sm border-secondary border-opacity-50 rounded-1 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle m-0 text-center custom-classic-table">
              <thead style={{ backgroundColor: '#e9ecef' }} className="text-secondary fw-bold border-bottom border-dark">
                <tr>
                  {/* 🌟 Th Código Clicável */}
                  <th style={{ width: '12%', cursor: 'pointer' }} onClick={() => solicitarOrdenacao('codigo')} className="user-select-none target-sort-th">
                    Código {renderSetasOrdenacao('codigo')}
                  </th>
                  {/* 🌟 Th Nome Clicável */}
                  <th className="text-start ps-4 user-select-none target-sort-th" style={{ cursor: 'pointer' }} onClick={() => solicitarOrdenacao('nome')}>
                    Nome {renderSetasOrdenacao('nome')}
                  </th>
                  {/* 🌟 Th CNPJ Clicável */}
                  <th style={{ width: '25%', cursor: 'pointer' }} onClick={() => solicitarOrdenacao('cnpj')} className="user-select-none target-sort-th">
                    CNPJ {renderSetasOrdenacao('cnpj')}
                  </th>
                  <th style={{ width: '8%' }}>Alterar</th>
                  <th style={{ width: '8%' }}>Excluir</th>
                </tr>
              </thead>
              <tbody>
                {clientesPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4 small">Nenhum registro encontrado.</td>
                  </tr>
                ) : (
                  // Renderiza a lista partindo do array ordenado e paginado corretamente
                  clientesPaginados.map((cliente) => (
                    <tr key={cliente.codigo}>
                      <td className="fw-medium text-secondary">{String(cliente.codigo).padStart(4, '0')}</td>
                      <td className="text-start ps-4 text-dark">{cliente.nome}</td>
                      <td className="text-muted">{cliente.cnpj}</td>
                      <td>
                        <button className="btn btn-link p-0 text-dark" data-bs-toggle="modal" data-bs-target="#clienteModal" onClick={() => handleEditarClick(cliente)}>
                          <i className="bi bi-pencil-square fs-5"></i>
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-link p-0 text-dark hover-danger-text" onClick={() => handleExcluir(cliente.codigo)}>
                          <i className="bi bi-trash3 fs-5"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO INTERATIVA */}
          <div className="card-footer bg-white border-top d-flex justify-content-center py-2">
            <div className="d-flex align-items-center gap-3 small text-dark fw-semibold user-select-none">
              <i 
                className={`bi bi-chevron-double-left ${paginaAtual === 1 ? 'text-muted opacity-50' : 'cursor-pointer'}`}
                onClick={paginaAtual > 1 ? irParaPrimeiraPagina : undefined}
                title="Primeira Página"
              ></i>
              <i 
                className={`bi bi-chevron-left ${paginaAtual === 1 ? 'text-muted opacity-50' : 'cursor-pointer'}`}
                onClick={paginaAtual > 1 ? voltarPagina : undefined}
                title="Página Anterior"
              ></i>
              <span className="px-2 bg-light border rounded" style={{ fontSize: '0.8rem', padding: '2px 8px' }}>
                {paginaAtual} de {totalPaginas}
              </span>
              <i 
                className={`bi bi-chevron-right ${paginaAtual === totalPaginas ? 'text-muted opacity-50' : 'cursor-pointer'}`}
                onClick={paginaAtual < totalPaginas ? avancarPagina : undefined}
                title="Próxima Página"
              ></i>
              <i 
                className={`bi bi-chevron-double-right ${paginaAtual === totalPaginas ? 'text-muted opacity-50' : 'cursor-pointer'}`}
                onClick={paginaAtual < totalPaginas ? irParaUltimaPagina : undefined}
                title="Última Página"
              ></i>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <div className="modal fade" id="clienteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-dark border-2 rounded-1">
            <div className="modal-header py-2 bg-light border-bottom border-secondary">
              <span className="fw-semibold text-dark small">
                {editando ? `Alterar Cliente #${clienteAtual.codigo}` : 'Novo Cliente'}
              </span>
              <button type="button" className="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form onSubmit={handleSalvar} className="p-3">
              <div className="modal-body p-0">
                <fieldset className="border border-dark rounded-1 p-3 pt-2 mb-3 position-relative">
                  <legend className="float-none w-auto px-2 m-0 fs-6 fw-bold text-dark small">Dados do Cliente</legend>
                  
                  <div className="row g-2 text-dark small">
                    <div className="col-6 col-sm-3 col-md-2">
                      <label className="form-label mb-0 fw-medium">Código:</label>
                      <input type="text" className="form-control form-control-sm bg-light border-dark" name="codigo" value={clienteAtual.codigo ? String(clienteAtual.codigo).padStart(4, '0') : '0007'} disabled />
                    </div>
                    <div className="col-12 col-sm-9 col-md-10">
                      <label className="form-label mb-0 fw-medium">Nome: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="nome" value={clienteAtual.nome} onChange={handleInputChange} maxLength="40" required />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <label className="form-label mb-0 fw-medium">CNPJ: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="cnpj" value={clienteAtual.cnpj} onChange={handleInputChange} maxLength="18" required />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <label className="form-label mb-0 fw-medium">RG: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="rg" value={clienteAtual.rg} onChange={handleInputChange} maxLength="17" required />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                      <label className="form-label mb-0 fw-medium">Nascimento:</label>
                      <div className="input-group input-group-sm">
                        <input type="date" className="form-control border-dark rounded-0" name="nascimento" value={clienteAtual.nascimento || ''} onChange={handleInputChange} />
                        <span className="input-group-text bg-white border-dark"><i className="bi bi-calendar3"></i></span>
                      </div>
                    </div>
                    <div className="col-12 col-md-8">
                      <label className="form-label mb-0 fw-medium">Endereço: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="endereco" value={clienteAtual.endereco} onChange={handleInputChange} maxLength="40" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label mb-0 fw-medium">Complemento:</label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="complemento" value={clienteAtual.complemento || ''} onChange={handleInputChange} maxLength="20" />
                    </div>
                    <div className="col-12 col-sm-5 col-md-5">
                      <label className="form-label mb-0 fw-medium">Bairro: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="bairro" value={clienteAtual.bairro} onChange={handleInputChange} maxLength="20" required />
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                      <label className="form-label mb-0 fw-medium">CEP:</label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="cep" value={clienteAtual.cep || ''} onChange={handleInputChange} />
                    </div>
                    <div className="col-12 col-sm-4 col-md-4">
                      <label className="form-label mb-0 fw-medium">Cidade: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="cidade" value={clienteAtual.cidade} onChange={handleInputChange} maxLength="20" required />
                    </div>
                    <div className="col-6 col-sm-2 col-md-1">
                      <label className="form-label mb-0 fw-medium">UF: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="uf" value={clienteAtual.uf} onChange={handleInputChange} maxLength="2" required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label mb-0 fw-medium">Telefone:</label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="telefone" value={clienteAtual.telefone || ''} onChange={handleInputChange} maxLength="13" />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label mb-0 fw-medium">Celular: <span className="text-danger">*</span></label>
                      <input type="text" className="form-control form-control-sm border-dark rounded-0" name="celular" value={clienteAtual.celular || ''} onChange={handleInputChange} maxLength="15" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label mb-0 fw-medium">Observação:</label>
                      <textarea className="form-control border-dark rounded-0" name="observacao" value={clienteAtual.observacao || ''} onChange={handleInputChange} maxLength="150" rows="3"></textarea>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-white border-dark border-2 fw-bold text-dark btn-sm d-flex align-items-center gap-1 px-3 shadow-sm rounded-1">
                  <i className="bi bi-check-lg fw-bold"></i> Salvar
                </button>
                <button type="button" className="btn btn-white border-dark border-2 fw-bold text-dark btn-sm d-flex align-items-center gap-1 px-3 shadow-sm rounded-1" data-bs-dismiss="modal">
                  <i className="bi bi-x-lg fw-bold text-danger"></i> Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .custom-classic-table th { font-size: 0.85rem; color: #333 !important; font-weight: 700; vertical-align: middle; }
        .custom-classic-table td { font-size: 0.85rem; padding-top: 6px; padding-bottom: 6px; }
        .cursor-pointer { cursor: pointer; }
        .hover-danger-text:hover i { color: #dc3545 !important; }
        legend { font-size: 0.9rem !important; font-weight: 700 !important; }
        fieldset input, fieldset textarea { border-radius: 0px !important; }
        .target-sort-th:hover { background-color: rgba(0, 0, 0, 0.03); }
      `}</style>

    </div>
  );
}