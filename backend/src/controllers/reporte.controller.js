import { supabase } from '../config/supabase.js';

export const getEstadisticasGenerales = async (req, res) => {
    try {
        // Visitas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const { data: visitasHoy, error: errorHoy } = await supabase
            .from('visita')
            .select('id')
            .eq('fecha', hoy);

        if (errorHoy) return res.status(500).json({ error: errorHoy.message });

        // Visitas totales
        const { data: visitasTotales, error: errorTotal } = await supabase
            .from('visita')
            .select('id', { count: 'exact' });

        if (errorTotal) return res.status(500).json({ error: errorTotal.message });

        // Visitantes activos (sin hora de salida)
        const { data: visitantesActivos, error: errorActivos } = await supabase
            .from('visita')
            .select('id')
            .is('hora_salida', null);

        if (errorActivos) return res.status(500).json({ error: errorActivos.message });

        // Tiempo promedio de permanencia (de visitas completadas hoy)
        const { data: visitasCompletadas, error: errorTiempo } = await supabase
            .from('visita')
            .select('hora_entrada, hora_salida')
            .eq('fecha', hoy)
            .not('hora_salida', 'is', null);

        if (errorTiempo) return res.status(500).json({ error: errorTiempo.message });

        let tiempoPromedio = '00:00:00';
        if (visitasCompletadas && visitasCompletadas.length > 0) {
            const tiempos = visitasCompletadas.map(v => {
                const entrada = new Date(`1970-01-01T${v.hora_entrada}`);
                const salida = new Date(`1970-01-01T${v.hora_salida}`);
                return salida.getTime() - entrada.getTime();
            });

            const promedioMs = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
            const horas = Math.floor(promedioMs / (1000 * 60 * 60));
            const minutos = Math.floor((promedioMs % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((promedioMs % (1000 * 60)) / 1000);
            tiempoPromedio = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        }

        res.json({
            visitas_hoy: visitasHoy?.length || 0,
            visitas_totales: visitasTotales?.length || 0,
            visitantes_activos: visitantesActivos?.length || 0,
            tiempo_promedio_permanencia: tiempoPromedio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVisitasPorDia = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = supabase
            .from('visita')
            .select('fecha')
            .order('fecha');

        if (fecha_inicio) query = query.gte('fecha', fecha_inicio);
        if (fecha_fin) query = query.lte('fecha', fecha_fin);

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });

        // Agrupar por fecha
        const agrupado = data.reduce((acc, visita) => {
            const fecha = visita.fecha;
            acc[fecha] = (acc[fecha] || 0) + 1;
            return acc;
        }, {});

        const resultado = Object.entries(agrupado).map(([fecha, cantidad]) => ({
            fecha,
            cantidad
        }));

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVisitasPorDespacho = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = supabase
            .from('visita')
            .select(`
                despacho(id, nombre)
            `);

        if (fecha_inicio) query = query.gte('fecha', fecha_inicio);
        if (fecha_fin) query = query.lte('fecha', fecha_fin);

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });

        // Calcular total de visitas
        const totalVisitas = data.length;

        // Agrupar por despacho
        const agrupado = data.reduce((acc, visita) => {
            const nombre = visita.despacho?.nombre || 'Sin despacho';
            acc[nombre] = (acc[nombre] || 0) + 1;
            return acc;
        }, {});

        const resultado = Object.entries(agrupado).map(([despacho, cantidad]) => ({
            despacho,
            cantidad,
            porcentaje: totalVisitas > 0 ? Math.round((cantidad / totalVisitas) * 100) : 0
        }));

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTiempoPromedio = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        let query = supabase
            .from('visita')
            .select('hora_entrada, hora_salida, despacho(nombre)')
            .not('hora_salida', 'is', null);

        if (fecha_inicio) query = query.gte('fecha', fecha_inicio);
        if (fecha_fin) query = query.lte('fecha', fecha_fin);

        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });

        if (!data || data.length === 0) {
            return res.json([]);
        }

        // Calcular tiempos por despacho
        const tiemposPorDespacho = data.reduce((acc, visita) => {
            const despacho = visita.despacho?.nombre || 'Sin despacho';
            const entrada = new Date(`1970-01-01T${visita.hora_entrada}`);
            const salida = new Date(`1970-01-01T${visita.hora_salida}`);
            const tiempoMs = salida.getTime() - entrada.getTime();

            if (!acc[despacho]) {
                acc[despacho] = { totalTiempo: 0, count: 0 };
            }
            acc[despacho].totalTiempo += tiempoMs;
            acc[despacho].count += 1;

            return acc;
        }, {});

        const resultado = Object.entries(tiemposPorDespacho).map(([despacho, datos]) => {
            const promedioMs = datos.totalTiempo / datos.count;
            const horas = Math.floor(promedioMs / (1000 * 60 * 60));
            const minutos = Math.floor((promedioMs % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((promedioMs % (1000 * 60)) / 1000);

            return {
                despacho,
                tiempo_promedio: `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`,
                visitas_totales: datos.count
            };
        });

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};