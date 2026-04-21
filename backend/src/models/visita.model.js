import { supabase } from '../config/supabase.js';

export const createVisita = async (data) => {
    return await supabase.from('visita').insert([data]).select();
};

export const updateSalida = async (id, hora) => {
    return await supabase
        .from('visita')
        .update({ hora_salida: hora })
        .eq('id', id)
        .select();
};

export const getVisitaById = async (id) => {
    return await supabase
        .from('visita')
        .select(`
            id,
            fecha,
            hora_entrada,
            hora_salida,
            persona_visitada,
            persona(id, nombre, dni),
            despacho(id, nombre)
        `)
        .eq('id', id)
        .single();
};

export const getVisitas = async ({ fecha, nombre, despacho, dni } = {}) => {
    let query = supabase
        .from('visita')
        .select(`
            id,
            fecha,
            hora_entrada,
            hora_salida,
            persona_visitada,
            persona(id, nombre, dni),
            despacho(id, nombre)
        `);

    if (fecha) query = query.eq('fecha', fecha);
    if (nombre) query = query.ilike('persona.nombre', `%${nombre}%`);
    if (dni) query = query.ilike('persona.dni', `%${dni}%`);
    if (despacho) query = query.eq('id_despacho', despacho);

    return await query;
};