import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Middleware que verifica el JWT y adjunta req.user */
export function protect(req, res, next) {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adjuntar solo el id, el user se carga si se necesita
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: 'No autorizado. Token inválido o expirado.' });
  }
}

/** Middleware que requiere rol admin */
export function adminOnly(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol admin.' });
  }
  next();
}

/** Genera un JWT para un usuario */
export function generateToken(user) {
  return jwt.sign(
    { id: user._id || user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}
