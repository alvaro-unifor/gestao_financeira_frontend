import React, { useEffect, useState } from 'react';
import { listarReceitas, criarReceita, deletarReceita, atualizarReceita, listarMaioresReceitas, listarMenoresReceitas, listarReceitasPorMes, listarReceitasPorPeriodo } from '../services/ReceitaService';
import { listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa, listarMaioresDespesas, listarMenoresDespesas, listarDespesasPorMes, listarDespesasPorPeriodo } from '../services/DespesaService';
import { listarCategorias, cadastrarCategoria } from '../services/CategoriaService';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';

const Dashboard = ({ token }) => {
    const [transacoes, setTransacoes] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [novaReceita, setNovaReceita] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'RECEITA' });
    const [despesaEditando, setDespesaEditando] = useState(null);
    const [receitaEditando, setReceitaEditando] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const receitasData = await listarReceitas(token);
            //const despesasData = await listarDespesas(token, userId);
            ///const categoriasData = await listarCategorias(token);
            setTransacoes(receitasData);
            //setDespesas(despesasData);
            //setCategorias(categoriasData);
        };
        fetchData();
    }, [token]);

    const handleReceitaChange = (e) => {
        const { name, value } = e.target;
        setNovaReceita({ ...novaReceita, [name]: value });
    };

    const handleDespesaChange = (e) => {
        const { name, value } = e.target;
        setNovaDespesa({ ...novaDespesa, [name]: value });
    };

    const handleCategoriaChange = (e) => {
        const { name, value } = e.target;
        setNovaCategoria({ ...novaCategoria, [name]: value });
    };

    const handleReceitaSubmit = async (e) => {
        e.preventDefault();
        const createdReceita = await criarReceita({ ...novaReceita, usuario: userId }, token);
        setReceitas([...transacoes, createdReceita]);
        setNovaReceita({ descricao: '', valor: '', data: '', categoria: '' });
    };

    const handleDespesaSubmit = async (e) => {
        e.preventDefault();
        const createdDespesa = await criarDespesa({ ...novaDespesa, usuario: userId }, token);
        setDespesas([...despesas, createdDespesa]);
        setNovaDespesa({ descricao: '', valor: '', data: '', categoria: '' });
    };

    const handleCategoriaSubmit = async (e) => {
        e.preventDefault();
        const createdCategoria = await cadastrarCategoria(novaCategoria, token);
        setCategorias([...categorias, createdCategoria]);
        setNovaCategoria({ nome: '', tipo: 'RECEITA' });
    };

    const handleDeleteReceita = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta receita?");
        if (confirmDelete) {
            const success = await deletarReceita(id, token);
            if (success) {
                setReceitas(transacoes.filter((receita) => receita.id !== id));
            } else {
                alert("Erro ao excluir a receita. Tente novamente.");
            }
        }
    };

    const handleDeleteDespesa = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta despesa?");
        if (confirmDelete) {
            const success = await deletarDespesa(id, token);
            if (success) {
                setDespesas(despesas.filter((despesa) => despesa.id !== id));
            } else {
                alert("Erro ao excluir a despesa. Tente novamente.");
            }
        }
    };

    const handleEditDespesa = (despesa) => {
        setDespesaEditando(despesa); // Define a despesa que será editada
    };

    const handleSaveDespesa = async () => {
        if (despesaEditando) {
            const success = await atualizarDespesa(despesaEditando.id, despesaEditando, token);
            if (success) {
                setDespesas(despesas.map((despesa) => (despesa.id === despesaEditando.id ? despesaEditando : despesa)));
                setDespesaEditando(null); // Fecha o modo de edição
            } else {
                alert("Erro ao atualizar a despesa. Tente novamente.");
            }
        }
    };

    const handleEditReceita = (transacoes) => {
        setReceitaEditando(transacoes); // Define a receita que será editada
    };


    const handleSaveReceita = async () => {
        if (receitaEditando) {
            const success = await atualizarReceita(receitaEditando.id, receitaEditando, token);
            if (success) {
                setTransacoes(receitas.map((receita) => (receita.id === receitaEditando.id ? receitaEditando : receita)));
                setReceitaEditando(null); // Fecha o modo de edição
            } else {
                alert("Erro ao atualizar a receita. Tente novamente.");
            }
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Gerenciamento AI</h1>

            {/* Seção de Receitas */}
            <div className="receitas-section">
                <h2 className="receitas-title">Receitas</h2>
                {/* Tabela de Receitas */}
                <table className="receitas-table">
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.map((receita) => (
                            <tr key={transacoes.id}>
                                <td>{transacoes.descricao}</td>
                                <td>{transacoes.valor}</td>
                                <td>{transacoes.data}</td>
                                <td>{transacoes.descricaoCategoria ? transacoes.descricaoCategoria : 'Sem Categoria'}</td>
                                <td className="acoes">
                                    <button
                                        onClick={() => handleDeleteReceita(transacoes.id)}
                                        className="btn-excluir"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => handleEditReceita(transacoes)}
                                        className="btn-editar"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {receitaEditando && (
                    <div className="editar-receita">
                        <h3>Editar Receita</h3>
                        <input
                            type="text"
                            name="descricao"
                            placeholder="Descrição"
                            value={receitaEditando.descricao}
                            onChange={(e) =>
                                setReceitaEditando({ ...receitaEditando, descricao: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor"
                            value={receitaEditando.valor}
                            onChange={(e) =>
                                setReceitaEditando({ ...receitaEditando, valor: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="date"
                            name="data"
                            placeholder="Data"
                            value={receitaEditando.data}
                            onChange={(e) =>
                                setReceitaEditando({ ...receitaEditando, data: e.target.value })
                            }
                            className="input"
                        />
                        <select
                            name="categoria"
                            value={receitaEditando.categoria}
                            onChange={(e) =>
                                setReceitaEditando({ ...receitaEditando, categoria: e.target.value })
                            }
                            className="input"
                        >
                            <option value="">Selecione uma Categoria</option>
                            {categorias
                                .filter((categoria) => categoria.tipo === 'RECEITA')
                                .map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </option>
                                ))}
                        </select>
                        <div className="botoes-editar">
                            <button onClick={handleSaveReceita} className="btn-salvar">
                                Salvar
                            </button>
                            <button onClick={() => setReceitaEditando(null)} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleReceitaSubmit} className="form-receita">
                    <h3>Adicionar Nova Receita</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={novaReceita.descricao}
                        onChange={handleReceitaChange}
                        className="input"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={novaReceita.valor}
                        onChange={handleReceitaChange}
                        className="input"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={novaReceita.data}
                        onChange={handleReceitaChange}
                        className="input"
                    />
                    <select
                        name="categoria"
                        value={novaReceita.categoria}
                        onChange={handleReceitaChange}
                        className="input"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias.filter(categoria => categoria.tipo === 'RECEITA').map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="btn-adicionar">
                        Adicionar Transação
                    </button>
                </form>
            </div>

            {/* Seção de Despesas */}
            <div className="mb-8">
                <h2 className="text-3xl mb-4 text-red-600">Despesas</h2>

                {/* Tabela de Despesas */}
                <table className="min-w-full bg-white mb-8 rounded-xl shadow-lg">
                    <thead>
                        <tr className="bg-red-100">
                            <th className="py-4 px-6">Descrição</th>
                            <th className="py-4 px-6">Valor</th>
                            <th className="py-4 px-6">Data</th>
                            <th className="py-4 px-6">Categoria</th>
                            <th className="py-4 px-6">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(despesas).map((despesa) => (
                            <tr key={despesa.id} className="border-t">
                                <td className="py-4 px-6">{despesa.descricao}</td>
                                <td className="py-4 px-6">{despesa.valor}</td>
                                <td className="py-4 px-6">{despesa.data}</td>
                                <td className="py-4 px-6">{despesa.descricaoCategoria ? despesa.descricaoCategoria : 'Sem Categoria'}</td>
                                <td className="py-4 px-6 flex space-x-4">
                                    <button
                                        onClick={() => handleDeleteDespesa(despesa.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => handleEditDespesa(despesa)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {despesaEditando && (
                    <div className="mb-8 p-6 bg-red-50 rounded-xl shadow-lg">
                        <h3 className="text-3xl mb-6 text-red-600">Editar Despesa</h3>
                        <input
                            type="text"
                            name="descricao"
                            placeholder="Descrição"
                            value={despesaEditando.descricao}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, descricao: e.target.value })
                            }
                            className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor"
                            value={despesaEditando.valor}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, valor: e.target.value })
                            }
                            className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                        />
                        <input
                            type="date"
                            name="data"
                            placeholder="Data"
                            value={despesaEditando.data}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, data: e.target.value })
                            }
                            className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                        />
                        <select
                            name="categoria"
                            value={despesaEditando.categoria}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, categoria: e.target.value })
                            }
                            className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                        >
                            <option value="">Selecione uma Categoria</option>
                            {categorias
                                .filter((categoria) => categoria.tipo === 'DESPESA')
                                .map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </option>
                                ))}
                        </select>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleSaveDespesa}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl"
                            >
                                Salvar
                            </button>
                            <button
                                onClick={() => setDespesaEditando(null)}
                                className="bg-gray-600 text-white px-6 py-3 rounded-xl"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleDespesaSubmit} className="mb-8 p-6 bg-red-50 rounded-xl shadow-lg">
                    <h3 className="text-3xl mb-6 text-red-600">Adicionar Nova Despesa</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={novaDespesa.descricao}
                        onChange={handleDespesaChange}
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={novaDespesa.valor}
                        onChange={handleDespesaChange}
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={novaDespesa.data}
                        onChange={handleDespesaChange}
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    />
                    <select
                        name="categoria"
                        value={novaDespesa.categoria}
                        onChange={handleDespesaChange}
                        className="mb-6 p-4 border border-red-400 rounded-xl w-full bg-white"
                    >
                        <option value="">Selecione uma Categoria</option>
                        {categorias.filter(categoria => categoria.tipo === 'DESPESA').map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-red-500 text-white p-4 rounded-xl w-full border-2 border-transparent transition-colors duration-300 ease-in-out hover:bg-white hover:text-red-500 hover:border-red-500"
                    >
                        Adicionar Despesa
                    </button>
                </form>
            </div>

            {/* Seção de Categorias */}
            <div className="mb-8">
                <h2 className="text-3xl mb-4 text-purple-600">Categorias</h2>
                <table className="min-w-full bg-white mb-8 rounded-xl shadow-lg">
                    <thead>
                        <tr className="bg-purple-100">
                            <th className="py-4 px-6">Nome</th>
                            <th className="py-4 px-6">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id} className="border-t">
                                <td className="py-4 px-6">{categoria.nome}</td>
                                <td className="py-4 px-6">{categoria.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <form onSubmit={handleCategoriaSubmit} className="mb-8 p-6 bg-purple-50 rounded-xl shadow-lg">
                    <h3 className="text-3xl mb-6 text-purple-600">Adicionar Nova Categoria</h3>
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={novaCategoria.nome}
                        onChange={handleCategoriaChange}
                        className="mb-6 p-4 border border-purple-400 rounded-xl w-full bg-white"
                    />
                    <select
                        name="tipo"
                        value={novaCategoria.tipo}
                        onChange={handleCategoriaChange}
                        className="mb-6 p-4 border border-purple-400 rounded-xl w-full bg-white"
                    >
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-purple-500 text-white p-4 rounded-xl w-full border-2 border-transparent transition-colors duration-300 ease-in-out hover:bg-white hover:text-purple-500 hover:border-purple-500"
                    >
                        Adicionar Categoria
                    </button>
                </form>
            </div>
        </div>


    );

};

export default Dashboard;