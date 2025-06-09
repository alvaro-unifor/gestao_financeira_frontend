import React, { useEffect, useState } from 'react';
import { listarTransacao, criarTransacao, deletarTransacao, atualizarReceita, listarMaioresReceitas, listarMenoresReceitas, listarReceitasPorMes, listarReceitasPorPeriodo } from '../services/ReceitaService';
import { listarDespesas, criarDespesa, deletarDespesa, atualizarDespesa, listarMaioresDespesas, listarMenoresDespesas, listarDespesasPorMes, listarDespesasPorPeriodo } from '../services/DespesaService';
import { listarCategorias, cadastrarCategoria } from '../services/CategoriaService';
import './Dashboard.css';

const Dashboard = ({ token, userId }) => {
    const [transacoes, setTransacoes] = useState([]);
    const [tags, setTags] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [novaTransacao, setNovaTransacao] = useState({ description: '', amount: '', date: null, tags_ids: [], type: 'RECEITA' });
    const [novaDespesa, setNovaDespesa] = useState({ descricao: '', valor: '', data: '', categoria: '' });
    const [novaCategoria, setNovaCategoria] = useState({ nome: '', tipo: 'RECEITA' });
    const [despesaEditando, setDespesaEditando] = useState(null);
    const [receitaEditando, setReceitaEditando] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const transacoesData = await listarTransacao(token);
            const tagsData = await listarDespesas(token);
            ///const categoriasData = await listarCategorias(token);
            setTransacoes(transacoesData);
            setTags(tagsData);
            //setCategorias(categoriasData);
        };
        fetchData();
    }, [token, userId]);

    const handleTransacaoChange = (e) => {
        const { name, value } = e.target;
        setNovaTransacao({ ...novaTransacao, [name]: value });
    };

    const handleDespesaChange = (e) => {
        const { name, value } = e.target;
        setNovaDespesa({ ...novaDespesa, [name]: value });
    };

    const handleCategoriaChange = (e) => {
        const { name, value } = e.target;
        setNovaCategoria({ ...novaCategoria, [name]: value });
    };

    const handleTransacaoSubmit = async (e) => {
        e.preventDefault();
        const createdTransacao = await criarTransacao(novaTransacao, token, userId);
        setTransacoes([...transacoes, createdTransacao]);
        setNovaTransacao({ description: '', amount: '', date: '', tags_ids: [] });
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
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta transação?");
        if (confirmDelete) {
            const success = await deletarTransacao(id, token);
            if (success) {
                setTransacoes(transacoes.filter((transacao) => transacao.id !== id));
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
        setReceitaEditando(transacoes);
    };


    const handleSaveReceita = async () => {
        if (receitaEditando) {
            console.log('Salvando receita editada:', receitaEditando);
            const success = await atualizarReceita(receitaEditando, token, userId);
            if (success) {
                setTransacoes(transacoes.map((transacao) => (transacao.id === receitaEditando.id ? receitaEditando : transacao)));
                setReceitaEditando(null);
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
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.map((transacao) => (
                            <tr key={transacao.id}>
                                <td>{transacao.description}</td>
                                <td>{transacao.amount}</td>
                                <td>{transacao.date}</td>
                                <td>{transacao.type}</td>
                                <td>
                                    {transacao.tags && transacao.tags.length > 0
                                    ? transacao.tags.map(tag => tag.name).join(', ')
                                    : 'Sem Tags'}
                                </td>
                                <td className="acoes">
                                    <button
                                        onClick={() => handleDeleteReceita(transacao.id)}
                                        className="btn-excluir"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => handleEditReceita(transacao)}
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
                                setReceitaEditando({ ...receitaEditando, description: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor"
                            value={receitaEditando.valor}
                            onChange={(e) =>
                                setReceitaEditando({ ...receitaEditando, amount: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="date"
                            name="data"
                            value={receitaEditando.data || ""}
                            onChange={e =>
                                setReceitaEditando({ ...receitaEditando, data: e.target.value })
                            }
                            className="input"
                            />
                        <select
                            name="type"
                            value={receitaEditando.type || ""}
                            onChange={e =>
                                setReceitaEditando({ ...receitaEditando, type: e.target.value })
                            }
                            className="input"
                        >
                            <option value="">Selecione o Tipo</option>
                            <option value="RECEITA">Receita</option>
                            <option value="DESPESA">Despesa</option>
                        </select>
                        <label htmlFor="tags-select" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            Tags (segure Ctrl ou Shift para selecionar várias)
                        </label>
                        <select
                            id="tags-select"
                            name="tags"
                            multiple
                            value={receitaEditando.tag_ids || []}
                            onChange={e => {
                                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                                setReceitaEditando({ ...receitaEditando, tag_ids: selected });
                            }}
                            className="input"
                            size={Math.min(tags.length, 6)} // mostra até 6 opções visíveis
                        >
                            {tags.map(tag => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <small style={{ display: 'block', marginTop: 4, color: '#666' }}>
                            Segure Ctrl (Windows) ou Command (Mac) para selecionar várias tags.
                        </small>
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

                <form onSubmit={handleTransacaoSubmit} className="form-receita">
                    <h3>Adicionar Nova Transação</h3>
                    <input
                        type="text"
                        name="description"
                        placeholder="Descrição"
                        value={novaTransacao.description}
                        onChange={handleTransacaoChange}
                        className="input"
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Valor"
                        value={novaTransacao.amount}
                        onChange={handleTransacaoChange}
                        className="input"
                    />
                    <input
                        type="date"
                        name="date"
                        placeholder="Data"
                        value={novaTransacao.date}
                        onChange={handleTransacaoChange}
                        className="input"
                    />

                    <select
                        name="type"
                        value={novaTransacao.type}
                        onChange={handleTransacaoChange}
                        className="input"
                    >
                        <option value="RECEITA">Receita</option>
                        <option value="DESPESA">Despesa</option>
                    </select>
                    <label htmlFor="tags-select" style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            Tags (segure Ctrl ou Shift para selecionar várias)
                    </label>
                    <select
                        id="tags-select"
                        name="tags_ids"
                        multiple
                        value={novaTransacao.tags_ids || []}
                        onChange={e => {
                                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                                setNovaTransacao({ ...novaTransacao, tags_ids: selected });
                            }}
                        className="input"
                        size={Math.min(tags.length, 6)}
                    >
                        {tags.map(tag => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <small style={{ display: 'block', marginTop: 4, color: '#666' }}>
                        Segure Ctrl (Windows) ou Command (Mac) para selecionar várias tags.
                    </small>
                    <button type="submit" className="btn-adicionar">
                        Adicionar Transação
                    </button>
                </form>
            </div>

            {/* Seção de Despesas */}
            <div className="despesas-section">
                <h2 className="despesas-title">Tags</h2>
                <table className="despesas-table">
                    <thead>
                        <tr className="despesas-header">
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag.id} className="despesas-row">
                                <td>{tag.name}</td>
                                <td className="despesas-acoes">
                                    <button
                                        onClick={() => handleDeleteDespesa(tag.id)}
                                        className="btn-excluir"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => handleEditDespesa(tag)}
                                        className="btn-editar"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {despesaEditando && (
                    <div className="editar-despesa">
                        <h3>Editar Despesa</h3>
                        <input
                            type="text"
                            name="descricao"
                            placeholder="Descrição"
                            value={despesaEditando.descricao}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, descricao: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor"
                            value={despesaEditando.valor}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, valor: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="date"
                            name="data"
                            placeholder="Data"
                            value={despesaEditando.data}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, data: e.target.value })
                            }
                            className="input"
                        />
                        <select
                            name="categoria"
                            value={despesaEditando.categoria}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, categoria: e.target.value })
                            }
                            className="input"
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
                        <div className="botoes-editar">
                            <button onClick={handleSaveDespesa} className="btn-salvar">
                                Salvar
                            </button>
                            <button onClick={() => setDespesaEditando(null)} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleDespesaSubmit} className="form-despesa">
                    <h3>Adicionar Nova Despesa</h3>
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={novaDespesa.descricao}
                        onChange={handleDespesaChange}
                        className="input"
                    />
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor"
                        value={novaDespesa.valor}
                        onChange={handleDespesaChange}
                        className="input"
                    />
                    <input
                        type="date"
                        name="data"
                        placeholder="Data"
                        value={novaDespesa.data}
                        onChange={handleDespesaChange}
                        className="input"
                    />
                    <select
                        name="categoria"
                        value={novaDespesa.categoria}
                        onChange={handleDespesaChange}
                        className="input"
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
                        className="btn-adicionar"
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