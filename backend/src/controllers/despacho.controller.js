import * as Despacho from '../models/despacho.model.js';

export const getDespachos = async (req, res) => {
    const { data, error } = await Despacho.getAll();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const getDespacho = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await Despacho.getById(id);
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Despacho no encontrado' });
    res.json(data);
};

export const getPersonasDespacho = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await Despacho.getPersonas(id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const crearDespacho = async (req, res) => {
    const { nombre } = req.body;
    const { data, error } = await Despacho.create(nombre);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const actualizarDespacho = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const { data, error } = await Despacho.update(id, nombre);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

export const eliminarDespacho = async (req, res) => {
    const { id } = req.params;
    const { error } = await Despacho.remove(id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ status: 'ok', mensaje: 'Despacho eliminado' });
};