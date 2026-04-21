import { Parser } from 'json2csv';
import { supabase } from '../config/supabase.js';

export const exportCSV = async (req, res) => {
    const { data } = await supabase
        .from('visita')
        .select(`fecha, hora_entrada, hora_salida`);

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('visitas.csv');
    res.send(csv);
};