export const toUserPublicDTO = (user) => ({
  _id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  age: user.age,
  role: user.role,
  cart: user.cart
});

export const toCurrentUserDTO = (user) => ({
  _id: user._id,
  first_name: user.first_name,
  last_name: user.last_name,
  role: user.role,
  cart: user.cart
});
