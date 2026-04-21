import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/usuario.model.js';

export const login = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Cuerpo de la solicitud requerido' });
    }

    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const { data: user, error } = await User.findByUsuario(usuario);

    if (error || !user) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
        {
            sub: user.id,
            usuario: user.usuario,
            nombre: user.nombre,
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );

    return res.json({ status: 'ok', data: { token } });
};