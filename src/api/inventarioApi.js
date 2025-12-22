import clienteApi from './clienteApi';

export const getStockPorAlmacen = async (idAlmacen) => {
    const res = await clienteApi.get(`/inventario/almacen/${idAlmacen}`);
    return res.data;
};