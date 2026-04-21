import { supabase } from '../config/supabase.js';

export const findByDNI = async (dni) => {
    return await supabase
        .from('persona')
        .select('*')
        .eq('dni', dni)
        .single();
};

export const create = async (nombre, dni) => {
    return await supabase
        .from('persona')
        .insert([{ nombre, dni }])
        .select()
        .single();
};