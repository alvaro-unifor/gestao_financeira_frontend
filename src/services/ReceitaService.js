const API_URL = 'http://localhost:4000';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const criarReceita = async (receita, token) => {
    try {
        const userId = localStorage.getItem('id');
        const receitaComUsuario = { ...receita, usuario: userId };

        const response = await fetch(`${API_URL}/criar-receita`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(receitaComUsuario)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const atualizarReceita = async (receitaEditando, token, userId) => {
    try {
        console.log('Atualizando receita:', {
            amount: Number(receitaEditando.amount), 
            date: receitaEditando.date, 
            description: receitaEditando.description, 
            tag_ids: receitaEditando.tag_ids,
            user_id: userId,
            type: receitaEditando.type
        });
        const response = await fetch(`${API_URL}/api/transactions/${receitaEditando.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify({
                amount: Number(receitaEditando.amount),
                date: receitaEditando.data ? new Date(receitaEditando.data).toISOString() : null,
                description: receitaEditando.description, 
                tag_ids: receitaEditando.tag_ids,
                user_id: userId,
                type: receitaEditando.type
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const deletarReceita = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/deletar-receita/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarReceitas = async (token) => {
    try {
        const response = await fetch(`${API_URL}/api/transactions`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarReceitasPorMes = async (ano, mes, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/receitas/${userId}/mes/${ano}/${mes}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarReceitasPorPeriodo = async (dataInicio, dataFim, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/receitas/${userId}/periodo?dataInicio=${dataInicio}&dataFim=${dataFim}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarMaioresReceitas = async (limite, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/receitas/${userId}/maiores?limite=${limite}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const listarMenoresReceitas = async (limite, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/receitas/${userId}/menores?limite=${limite}`, {
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};