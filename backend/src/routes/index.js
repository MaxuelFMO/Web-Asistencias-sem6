import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/middleware.js';
import {
    crearVisita,
    salidaVisita,
    listarVisitas,
    getVisita,
} from '../controllers/visitas.controller.js';
import {
    getDespachos,
    getDespacho,
    getPersonasDespacho,
    crearDespacho,
    actualizarDespacho,
    eliminarDespacho,
} from '../controllers/despacho.controller.js';
import {
    getEstadisticasGenerales,
    getVisitasPorDia,
    getVisitasPorDespacho,
    getTiempoPromedio,
} from '../controllers/reporte.controller.js';
import { exportCSV } from '../controllers/export.controller.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API' });
});

router.post('/login', login);

router.post('/visitas', auth, crearVisita);
router.put('/visitas/:id', auth, salidaVisita);
router.get('/visitas', auth, listarVisitas);
router.get('/visitas/:id', auth, getVisita);

router.get('/despachos', auth, getDespachos);
router.get('/despachos/:id', auth, getDespacho);
router.get('/despachos/:id/personas', auth, getPersonasDespacho);
router.post('/despachos', auth, crearDespacho);
router.put('/despachos/:id', auth, actualizarDespacho);
router.delete('/despachos/:id', auth, eliminarDespacho);

router.get('/reportes/estadisticas', auth, getEstadisticasGenerales);
router.get('/reportes/visitas-dia', auth, getVisitasPorDia);
router.get('/reportes/visitas-despacho', auth, getVisitasPorDespacho);
router.get('/reportes/tiempo-promedio', auth, getTiempoPromedio);

router.get('/export/csv', auth, exportCSV);

export default router;