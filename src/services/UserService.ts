import UserRepository from '../repositories/dataBase/UserRepository';
// constructors
const userRepository = new UserRepository();

const getUserInfo = async (userId: string) => {
  const dbUser = await userRepository.show(userId);
  return dbUser;
};

const updateUserAddress = async (userId: string, address: string) => {
  const dbUser = await userRepository.show(userId);
  await userRepository.update(dbUser._id, { address: address });
  const data = await userRepository.show(userId);
  return data;
};

export default {
  getUserInfo,
  updateUserAddress,
};
