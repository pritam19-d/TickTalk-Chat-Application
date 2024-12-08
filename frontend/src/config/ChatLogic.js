export const getSenderName = (loggedUser, usersArr) => {
  return usersArr[0].name === loggedUser.name ? usersArr[1] : usersArr[0];
}