import { Expo } from "expo-server-sdk";

export const createNotificationMessage = (pushToken, title, message, page = "/home/notifications") => {
	return {
		to: pushToken,
		sound: "default",
		title: title,
		body: message,
		data: { screen: page },
	};
};


export const sendExpoPushNotification = async (expoPushToken/*: string*/, data/*: NotificationMessage*/) => {
	const expo = new Expo({ accessToken: process.env.EXPO_PUSH_ACCESS_TOKEN });

	const chunks = expo.chunkPushNotifications([{ to: expoPushToken, ...data }]);
	const tickets = [];

	chunks.map(async (chunk, index) => {
		try {
			const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			tickets.push(...ticketChunk);
		} catch (error) {
			console.error(error);
		}
	})


	let response = "";

	tickets.map(ticket => {
		if (ticket.status === "error") {
			if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
				response = "DeviceNotRegistered";
			}
		}

		if (ticket.status === "ok") {
			response = ticket.id;
		}
	})



	return response;
};