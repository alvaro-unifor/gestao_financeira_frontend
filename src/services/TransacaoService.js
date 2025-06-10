const API_URL = 'http://localhost:4000';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const criarTransacao = async (transacao, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/transactions`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({
                amount: Number(transacao.amount),
                date: transacao.date ? new Date(transacao.date).toISOString() : null,
                description: transacao.description,
                tag_ids: transacao.tags_ids,
                user_id: userId,
                type: transacao.type
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

export const atualizarReceita = async (receitaEditando, token, userId) => {
    try {
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

export const deletarTransacao = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/api/transactions/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        if (response.status === 204) {
            return true;
        }
        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
};

export const listarTransacao = async (token) => {
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