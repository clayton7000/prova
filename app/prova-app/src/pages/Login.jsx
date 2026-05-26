import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
    const [identificacao, setIdentificacao] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleIdentificacaoChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setIdentificacao(value);
    };

    const validarSenha = (senha) => {
        if (senha.length < 8 || senha.length > 16) return false;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temEspecial = /[@#$%^&+=!*]/.test(senha);
        return temMaiuscula && temNumero && temEspecial;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        if (!identificacao) {
            setErro('A identificação é obrigatória.');
            return;
        }

        if (!validarSenha(senha)) {
            setErro('A senha deve ter entre 8-16 caracteres, contendo pelo menos 1 maiúscula, 1 número e 1 caractere especial.');
            return;
        }

        const identificacaoFormatada = identificacao.padStart(8, '0');

        setLoading(true);
        try {
            await AuthService.login(identificacaoFormatada, senha);
            navigate('/home'); 
        } catch (err) {
            if (err.response && (err.response.status === 413 || err.response?.status === 401)) {
                setErro('Identificação ou senha incorretos.');
            } else {
                setErro('Erro ao conectar com o servidor. Tente mais tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setIdentificacao('');
        setSenha('');
        setErro('');
    };

    return (
        // min-vh-100 vw-100 garante ocupação total da janela física do navegador
        <div className="container-fluid min-vh-100 vw-100 p-0 m-0 overflow-x-hidden">
            <div className="row g-0 min-vh-100 w-100 m-0">
                
                {/* COLUNA ESQUERDA - PAINEL INSTITUCIONAL (100% de altura e largura da metade esquerda) */}
                <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5 h-100 min-vh-100"
                     style={{ 
                         background: 'radial-gradient(circle, #0a2540 0%, #020c1b 100%)'
                     }}>
                    
                    <div className="mb-4">
                        <h2 className="text-white fw-light m-0" style={{ fontSize: '1.8rem' }}>Tecnologia voltada à</h2>
                        <h1 className="text-white fw-bold m-0" style={{ fontSize: '2.8rem', letterSpacing: '1px' }}>Governança Pública</h1>
                    </div>

                    {/* Infográfico Centralizado */}
                    <div className="position-relative my-4 p-4" style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="p-5 border border-info border-opacity-25 rounded-circle d-flex flex-column align-items-center justify-content-center" 
                             style={{ background: 'rgba(10, 37, 64, 0.5)', backdropFilter: 'blur(4px)', aspectRatio: '1/1' }}>
                            
                            <div className="mb-2">
                                <span className="fw-bolder text-warning h1 m-0 d-block" style={{ fontStyle: 'italic', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Ágape</span>
                                <small className="text-white-50 d-block" style={{ fontSize: '0.75rem', marginTop: '-5px' }}>Sistemas e Tecnologia</small>
                            </div>

                            <h5 className="text-info fw-semibold mb-1" style={{ fontSize: '1.2rem' }}>Governança Pública</h5>
                            <span className="badge bg-info text-dark fw-bold px-3 py-1.5" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>INTEGRADA</span>
                        </div>
                    </div>

                    <div className="text-white-50 small mt-3">
                        Sistemas Inteligentes Integrados para Gestão Municipal
                    </div>
                </div>

                {/* COLUNA DIREITA - FORMULÁRIO DE LOGIN (100% de altura e largura da metade direita) */}
                <div className="col-lg-6 bg-light d-flex flex-column justify-content-center align-items-center p-5 h-100 min-vh-100">
                    
                    <div className="w-100" style={{ maxWidth: '420px' }}>
                        {/* Logo Superior Direita */}
                        <div className="text-center mb-5">
                            <h1 className="fw-bolder text-warning m-0" style={{ fontStyle: 'italic', fontSize: '3.8rem', textShadow: '1px 1px 1px rgba(0,0,0,0.1)' }}>Ágape</h1>
                            <p className="text-muted small m-0" style={{ fontSize: '0.8rem', marginTop: '-8px', letterSpacing: '2px' }}>SISTEMAS E TECNOLOGIA</p>
                        </div>

                        {/* Exibição de Erros */}
                        {erro && (
                            <div className="alert alert-danger w-100 mb-4" style={{ fontSize: '0.9rem' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {erro}
                            </div>
                        )}

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="w-100">
                            
                            {/* Identificação do Usuário */}
                            <div className="mb-4">
                                <label className="form-label text-secondary fw-semibold mb-1">
                                    Identificação do usuário: <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control bg-white border-secondary border-opacity-50 py-2.5 shadow-sm"
                                    style={{ borderRadius: '4px', fontWeight: '500' }}
                                    value={identificacao}
                                    onChange={handleIdentificacaoChange}
                                    maxLength={8}
                                    placeholder="Apenas números (máx. 8)"
                                    disabled={loading}
                                />
                            </div>

                            {/* Senha */}
                            <div className="mb-4">
                                <label className="form-label text-secondary fw-semibold mb-1">
                                    Senha: <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative d-flex align-items-center">
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        className="form-control bg-white border-secondary border-opacity-50 py-2.5 shadow-sm"
                                        style={{ borderRadius: '4px', paddingRight: '100px' }}
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        disabled={loading}
                                    />
                                    <div className="form-check position-absolute end-0 me-2 mb-0 bg-white ps-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="visualizarCheck"
                                            checked={mostrarSenha}
                                            onChange={() => setMostrarSenha(!mostrarSenha)}
                                        />
                                        <label className="form-check-label text-muted small user-select-none" htmlFor="visualizarCheck">
                                            Visualizar
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div className="d-flex justify-content-between gap-3 mt-5">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4 py-2.5 fw-semibold flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: '4px', backgroundColor: '#0066cc', borderColor: '#0055b3' }}
                                    disabled={loading}
                                    >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Acessando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right"></i>
                                            Acessar
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary px-4 py-2.5 fw-semibold flex-grow-1 shadow-sm"
                                    style={{ borderRadius: '4px', backgroundColor: '#6c757d', borderColor: '#5a6268' }}
                                    onClick={handleCancelar}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Login;