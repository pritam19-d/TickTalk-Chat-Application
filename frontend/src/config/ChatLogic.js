export const getSenderName = (loggedUser, usersArr) => {
	return usersArr[0]?.name === loggedUser?.name ? usersArr[1] : usersArr[0];
};

export const getSenderFull = (loggedUser, usersArr) => {
	return usersArr[0]?._id === loggedUser?._id ? usersArr[1] : usersArr[0];
};

export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages?.length - 1 &&
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== userId
	);
};

export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages?.length - 1 &&
		messages[messages?.length - 1].sender._id &&
		messages[messages?.length - 1].sender._id !== userId
	);
};

export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages?.length - 1 &&
		messages[i + 1].sender._id !== userId &&
		messages[i].sender._id !== userId
	)
		return "36px";
	else if (
		(i < messages?.length - 1 &&
			messages[i + 1].sender._id !== m.sender._id &&
			messages[i].sender._id !== userId) ||
		(i === messages?.length - 1 && messages[i].sender._id !== userId)
	)
		return "0";
	else return "auto";
};

export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
