import usersService from "../services/user.service.js";

const getAll = async (req, res) => {
  try {
    const users = await usersService.getAll();
    return res.json({ status: "success", users });
  } catch {
    return res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getById = async (req, res) => {
  try {
    const user = await usersService.getById(req.params.uid);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ status: "success", user });
  } catch {
    return res.status(500).json({ error: "Error al buscar el usuario" });
  }
};

const updateById = async (req, res) => {
  try {
    const user = await usersService.updateById(req.params.uid, req.body);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ status: "success", user });
  } catch {
    return res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

const deleteById = async (req, res) => {
  try {
    const ok = await usersService.deleteById(req.params.uid);
    if (!ok) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ status: "success", message: "Usuario eliminado correctamente" });
  } catch {
    return res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

export default { getAll, getById, updateById, deleteById };
