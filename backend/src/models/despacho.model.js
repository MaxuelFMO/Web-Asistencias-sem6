import { supabase } from '../config/supabase.js';

export const getAll = async () => {
    return await supabase.from('despacho').select('*').order('id', { ascending: true });
};

export const getById = async (id) => {
    return await supabase.from('despacho').select('*').eq('id', id).single();
};

export const getPersonas = async (despachoId) => {
    return await supabase
        .from('persona')
        .select('*')
        .eq('despacho_id', despachoId);
};

export const create = async (nombre) => {
    return await supabase.from('despacho').insert([{ nombre }]).select().single();
};

export const update = async (id, nombre) => {
    return await supabase.from('despacho').update({ nombre }).eq('id', id).select().single();
};

export const remove = async (id) => {
    return await supabase.from('despacho').delete().eq('id', id);
};