const API_URL = 'http://localhost:4000';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

export const listarTags = async (token) => {
    try {
        const response = await fetch(`${API_URL}/api/tags`, {
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

export const criarTag = async (tag, token, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/tags`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify({
                name: tag.name,
                user_id: userId,
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

export const atualizarTag = async (tag, token) => {
    console.log(tag)
    try {
        const response = await fetch(`${API_URL}/api/tags/${tag.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(token),
            body: JSON.stringify({
                name: tag.name
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

export const deletarTag = async (id, token) => {
    try {
        const response = await fetch(`${API_URL}/api/tags/${id}`, {
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