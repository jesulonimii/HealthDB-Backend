import { cert, initializeApp } from "firebase-admin/app";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const credentials = JSON.parse(process.env.GOOGLE_SERVICES_CREDENTIALS)


initializeApp({
	credential: cert(credentials),
});

const messaging = admin.messaging();

export const createFCMNotificationMessage = (pushToken, title, message, page = "/home/notifications") => {
	return {
		notification: {
			title: title,
			body: message,
		},
		data: {
			title: title,
			message: message,
			page: page,
			experienceId: '@jesulonimii/HealthDB',
			scopeKey: '@jesulonimii/HealthDB',
		},
	};
};

export const sendFCMPushNotification = async (token, data) => {

	const message = {
		...data,
		android: {
			notification: {
				sound: 'default',
			},
		},
		token: token,
	};


	const response = await messaging.send(message).then((response) => {
		console.log('Successfully sent notification message:', response);
		return response;
	}).catch((error) => {
		console.log('Error sending notification message:', error);
		return error;
	})

	return response

}