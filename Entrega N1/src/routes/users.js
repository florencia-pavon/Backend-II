import { Router } from 'express';
import UserModel from '../models/user.model.js';
import { passportCall } from '../middlewares/passportCall.js';
import { checkRole } from '../middlewares/auth.js';

const router = Router();

// Obtener todos los usuarios (solo admin)
router.get('/', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // ocultamos el hash
    res.json({ status: 'success', users });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:uid', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.uid).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ status: 'success', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

// Actualizar un usuario por ID (por ejemplo, cambiar el rol)
router.put('/:uid', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.uid, req.body, {
      new: true
    }).select('-password');
    if (!updatedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ status: 'success', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
router.delete('/:uid', passportCall('jwt'), checkRole(['admin']), async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.uid);
    if (!deletedUser) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ status: 'success', message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

export default router;
