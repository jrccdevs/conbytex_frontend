import clienteApi from './clienteApi';

export const getOrdenes = async () => {
    const res = await clienteApi.get('/ordenes');
    return res.data;
};

export const getOrdenById = async (id) => {
    const res = await clienteApi.get(`/ordenes/${id}`);
    return res.data;
};

export const createOrden = async (data) => {
    const res = await clienteApi.post('/ordenes', data);
    return res.data;
};

export const updateOrden = async (id, data) => {
    const res = await clienteApi.put(`/ordenes/${id}`, data);
    return res.data;
};

export const deleteOrden = async (id) => {
    const res = await clienteApi.delete(`/ordenes/${id}`);
    return res.data;
};