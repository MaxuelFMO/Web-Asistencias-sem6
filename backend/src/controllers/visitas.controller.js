import * as Persona from '../models/persona.model.js';
import * as Visita from '../models/visita.model.js';

export const crearVisita = async (req, res) => {
    const { nombre, dni, persona_visitada, id_despacho } = req.body;

    if (!nombre || !dni || !persona_visitada || !id_despacho) {
        return res.status(400).json({ error: 'Datos incompletos para registrar la visita' });
    }

    let { data: persona, error } = await Persona.findByDNI(dni);

    if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
    }

    if (!persona) {
        const resPersona = await Persona.create(nombre, dni);
        if (resPersona.error) {
            return res.status(500).json({ error: resPersona.error.message });
        }
        persona = resPersona.data;
    }

    const { error: visitaError } = await Visita.createVisita({
        id_persona: persona.id,
        id_despacho,
        persona_visitada,
    });

    if (visitaError) {
        return res.status(500).json({ error: visitaError.message });
    }

    res.json({ status: 'ok', mensaje: 'Visita registrada' });
};

export const salidaVisita = async (req, res) => {
    const { id } = req.params;
    const hora = new Date().toTimeString().split(' ')[0];

    const { error } = await Visita.updateSalida(id, hora);
    if (error) return res.status(500).json({ error: error.message });

    res.json({ status: 'ok', mensaje: 'Salida registrada' });
};

export const getVisita = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await Visita.getVisitaById(id);

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Visita no encontrada' });

    let tiempo = null;
    if (data.hora_salida) {
        const e = new Date(`1970-01-01T${data.hora_entrada}`);
        const s = new Date(`1970-01-01T${data.hora_salida}`);
        tiempo = new Date(s.getTime() - e.getTime()).toISOString().substr(11, 8);
    }

    const resultado = {
        id: data.id,
        nombre: data.persona?.nombre || null,
        dni: data.persona?.dni || null,
        persona_visitada: data.persona_visitada,
        despacho: data.despacho?.nombre || null,
        fecha: data.fecha,
        hora_entrada: data.hora_entrada,
        hora_salida: data.hora_salida,
        tiempo,
    };

    res.json(resultado);
};

export const listarVisitas = async (req, res) => {
    const { fecha, nombre, despacho, dni } = req.query;
    const filtros = {
        fecha: fecha || undefined,
        nombre: nombre || undefined,
        dni: dni || undefined,
        despacho: despacho ? Number(despacho) : undefined,
    };

    const { data, error } = await Visita.getVisitas(filtros);
    if (error) return res.status(500).json({ error: error.message });

    const resultado = (data || []).map((v) => {
        let tiempo = null;

        if (v.hora_salida) {
            const e = new Date(`1970-01-01T${v.hora_entrada}`);
            const s = new Date(`1970-01-01T${v.hora_salida}`);
            tiempo = new Date(s.getTime() - e.getTime()).toISOString().substr(11, 8);
        }

        return {
            id: v.id,
            nombre: v.persona?.nombre || null,
            dni: v.persona?.dni || null,
            persona_visitada: v.persona_visitada,
            despacho: v.despacho?.nombre || null,
            fecha: v.fecha,
            hora_entrada: v.hora_entrada,
            hora_salida: v.hora_salida,
            tiempo,
        };
    });

    res.json(resultado);
};