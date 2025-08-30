import accountService from "../services/account.service.js";

const getAccountView = async (req, res, next) => {
  try {
    const user = await accountService.getAccountPublic(req.user._id);
    return res.render("account", {
      title: "Mi cuenta",
      user,
      ok: req.query?.ok,
      err: req.query?.err,
    });
  } catch (err) {
    return next(err);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const { first_name, last_name, age, currentPassword, newPassword } = req.body;
    await accountService.updateProfile({
      userId: req.user._id,
      first_name,
      last_name,
      age,
      currentPassword,
      newPassword,
    });
    return res.redirect("/account?ok=1");
  } catch (err) {
    if (err.code === "BAD_PASSWORD") return res.redirect("/account?err=badpass");
    if (err.code === "USER_NOT_FOUND") return res.redirect("/login");
    return next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await accountService.deleteAccount({ userId: req.user._id, cartId: req.user.cart });
    res.clearCookie("jwtCookie");
    return res.redirect("/login");
  } catch (err) {
    return next(err);
  }
};

export default { getAccountView, updateAccount, deleteAccount };
