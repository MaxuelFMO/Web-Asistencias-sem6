import { supabase } from '../config/supabase.js';

export const findByUsuario = async (usuario) => {
    return await supabase
        .from('usuario')
        .select('*')
        .eq('usuario', usuario)
        .single();
};

export const create = async (usuario, nombre, password_hash) => {
    return await supabase
        .from('usuario')
        .insert([{ usuario, nombre, password_hash }])
        .select()
        .single();
};
