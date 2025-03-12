export const getSenderName = (loggedUser, usersArr) => {
  return usersArr[0].name === loggedUser.name ? usersArr[1] : usersArr[0];
}

export const getSenderFull = (loggedUser, usersArr) => {
  return usersArr[0]._id === loggedUser._id ? usersArr[1] : usersArr[0];
}