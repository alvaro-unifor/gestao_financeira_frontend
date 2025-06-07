// src/components/AuthComponent.jsx
import React, { useState } from 'react';
import { login, register } from '../services/AuthService.js';
import './AuthComponent.css';

const AuthComponent = ({ onLoginSuccess }) => {
    const [emailData, setEmailData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setEmailData({ ...emailData, [name]: value });
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpar mensagem de erro ao tentar logar novamente
        const data = await login(emailData);
        if (data && data.token) {
            onLoginSuccess(data.token, data.user_id);
        } else {
            setErrorMessage('Usuário não encontrado ou senha incorreta.');
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        await register(registerData);
        setIsRegistering(false);
    };

    return (
        <div className="auth-container">
            {isRegistering ? (
                <form onSubmit={handleRegisterSubmit} className="auth-form">
                    <h2 className="auth-title">Registrar</h2>

                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="auth-input"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="auth-input"
                    />

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Registrar Agora!
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsRegistering(false)}
                        className="auth-link"
                    >
                        Voltar para login!
                    </button>
                </form>
            ) : (
                <form onSubmit={handleLoginSubmit} className="auth-form login-form">
                    <h2 className="auth-title">Login</h2>

                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={emailData.email}
                        onChange={handleLoginChange}
                        className="auth-input"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        value={emailData.password}
                        onChange={handleLoginChange}
                        className="auth-input"
                    />

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Entrar
                    </button>

                    {errorMessage && (
                        <p className="auth-error">{errorMessage}</p>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsRegistering(true)}
                        className="auth-link"
                    >
                        Clique aqui para se registar!
                    </button>
                </form>
            )}
        </div>
    );
    // ...existing code...
};

export default AuthComponent;