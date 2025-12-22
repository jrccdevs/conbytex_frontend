import clienteApi from './clienteApi';

export const getMovimientos = async () => {
    const res = await clienteApi.get('/movimientos');
    return res.data;
};

export const getMovimientoById = async (id) => {
    const res = await clienteApi.get(`/movimientos/${id}`);
    return res.data;
};

export const createMovimiento = async (data) => {
    const res = await clienteApi.post('/movimientos', data);
    return res.data;
};

export const updateMovimiento = async (id, data) => {
    const res = await clienteApi.put(`/movimientos/${id}`, data);
    return res.data;
};

export const deleteMovimiento = async (id) => {
    const res = await clienteApi.delete(`/movimientos/${id}`);
    return res.data;
};
