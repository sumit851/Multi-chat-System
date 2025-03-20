const userMap = new Map();

export const addUser = (userId, socketId) => {
  userMap.set(userId, socketId);
};

export const removeUser = (userId) => {
  userMap.delete(userId);
};

export const getUserScoketId = (userId) => {
  return userMap.get(userId);
};
