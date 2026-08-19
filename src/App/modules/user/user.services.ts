const createUser = async (payload: any) => {};

const getUserById = async (userId: string) => {};

const getUserByEmail = async (email: string) => {};

const getMyProfile = async (userId: string) => {};

const updateMyProfile = async (userId: string, payload: any) => {};

const updateUser = async (userId: string, payload: any) => {};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {};

const updateUserRole = async (userId: string, role: string) => {};

const updateUserVerification = async (
  userId: string,
  isVerified: boolean,
) => {};

const deleteUser = async (userId: string) => {};

const getAllUsers = async (query: any) => {};

export const userService = {
  createUser,
  getUserById,
  getUserByEmail,
  getMyProfile,
  updateMyProfile,
  updateUser,
  changePassword,
  updateUserRole,
  updateUserVerification,
  deleteUser,
  getAllUsers,
};
