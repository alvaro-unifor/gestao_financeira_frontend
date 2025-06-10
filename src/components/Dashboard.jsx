import React, { useEffect, useState } from 'react';
import { listarTransacao, criarTransacao, deletarTransacao, atualizarReceita } from '../services/TransacaoService';
import { listarTags, criarTag, deletarTag, atualizarTag } from '../services/TagService';
import './Dashboard.css';

const Dashboard = ({ token, userId }) => {
    const [transacoes, setTransacoes] = useState([]);
    const [tags, setTags] = useState([]);
    const [novaTransacao, setNovaTransacao] = useState({ description: '', amount: '', date: null, tags_ids: [], type: 'RECEITA' });
    const [novaTag, setNovaTag] = useState({ name: '' });
    const [tagEditando, setTagEditando] = useState(null);
    const [transacaoEditando, setTransacaoEditando] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const transacoesData = await listarTransacao(token);
            const tagsData = await listarTags(token);
            setTransacoes(transacoesData);
            setTags(tagsData);
        };
        fetchData();
    }, [token, userId]);

    const handleTransacaoChange = (e) => {
        const { name, value } = e.target;
        setNovaTransacao({ ...novaTransacao, [name]: value });
    };

    const handleTagChange = (e) => {
        const { name, value } = e.target;
        setNovaTag({ ...novaTag, [name]: value });
    };

    const handleTransacaoSubmit = async (e) => {
        e.preventDefault();
        const createdTransacao = await criarTransacao(novaTransacao, token, userId);
        setTransacoes([...transacoes, createdTransacao]);
        setNovaTransacao({ description: '', amount: '', date: '', tags_ids: [] });
    };

    const handleTagSubmit = async (e) => {
        e.preventDefault();
        const createdTag = await criarTag(novaTag, token, userId);
        setTags([...tags, createdTag]);
        setNovaTag({ name: '' });
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

    const handleDeleteTag = async (id) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir esta tag?");
        if (confirmDelete) {
            const success = await deletarTag(id, token);
            if (success) {
                setTags(tags.filter((tag) => tag.id !== id));
            } else {
                alert("Erro ao excluir a despesa. Tente novamente.");
            }
        }
    };

    const handleEditTag = (tag) => {
        setTagEditando(tag); // Define a despesa que será editada
    };

    const handleSaveTag = async () => {
        if (tagEditando) {
            console.log(tagEditando);
            const success = await atualizarTag(tagEditando, token);
            if (success) {
                setTags(tags.map((tag) => (tag.id === tagEditando.id ? tagEditando : tag)));
                setTagEditando(null); // Fecha o modo de edição
            } else {
                alert("Erro ao atualizar a despesa. Tente novamente.");
            }
        }
    };

    const handleSaveReceita = async () => {
        if (transacaoEditando) {
            const success = await atualizarReceita(transacaoEditando, token, userId);
            if (success) {
                setTransacoes(transacoes.map((transacao) => (transacao.id === transacaoEditando.id ? transacaoEditando : transacao)));
                setTransacaoEditando(null);
            } else {
                alert("Erro ao atualizar a receita. Tente novamente.");
            }
        }
    };

    const handleEditReceita = (transacoes) => {
        setTransacaoEditando(transacoes);
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
                {transacaoEditando && (
                    <div className="editar-receita">
                        <h3>Editar Receita</h3>
                        <input
                            type="text"
                            name="descricao"
                            placeholder="Descrição"
                            value={transacaoEditando.descricao}
                            onChange={(e) =>
                                setTransacaoEditando({ ...transacaoEditando, description: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="number"
                            name="valor"
                            placeholder="Valor"
                            value={transacaoEditando.valor}
                            onChange={(e) =>
                                setTransacaoEditando({ ...transacaoEditando, amount: e.target.value })
                            }
                            className="input"
                        />
                        <input
                            type="date"
                            name="data"
                            value={transacaoEditando.data || ""}
                            onChange={e =>
                                setTransacaoEditando({ ...transacaoEditando, data: e.target.value })
                            }
                            className="input"
                        />
                        <select
                            name="type"
                            value={transacaoEditando.type || ""}
                            onChange={e =>
                                setTransacaoEditando({ ...transacaoEditando, type: e.target.value })
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
                            value={transacaoEditando.tag_ids || []}
                            onChange={e => {
                                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                                setTransacaoEditando({ ...transacaoEditando, tag_ids: selected });
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

            {/* Seção de Tags */}
            <div className="despesas-section">
                <h2 className="tags-title">Tags</h2>
                <table className="tags-table">
                    <thead>
                        <tr className="despesas-header">
                            <th style={{ width: "100%" }}>Descrição</th>
                            <th style={{ width: "100%" }}>Acões</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag.id} className="despesas-row">
                                <td>{tag.name}</td>
                                <td className="despesas-acoes">
                                    <button
                                        onClick={() => handleDeleteTag(tag.id)}
                                        className="btn-excluir"
                                    >
                                        Excluir
                                    </button>
                                    <button
                                        onClick={() => handleEditTag(tag)}
                                        className="btn-editar"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tagEditando && (
                    <div className="editar-despesa">
                        <h3>Editar Despesa</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Descrição"
                            value={tagEditando.name}
                            onChange={(e) =>
                                setTagEditando({ ...tagEditando, name: e.target.value })
                            }
                            className="input"
                        />
                        <div className="botoes-editar">
                            <button onClick={handleSaveTag} className="btn-salvar">
                                Salvar
                            </button>
                            <button onClick={() => setTagEditando(null)} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleTagSubmit} className="form-tag">
                    <h3>Adicionar Nova Tag</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Descrição"
                        value={novaTag.name}
                        onChange={handleTagChange}
                        className="input"
                    />
                    <button
                        type="submit"
                        className="btn-adicionar"
                    >
                        Adicionar Tag
                    </button>
                </form>
            </div>
        </div>


    );

};

export default Dashboard;