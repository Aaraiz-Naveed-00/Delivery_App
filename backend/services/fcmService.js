import admin from "../config/firebase.js";

// Send notification to topic
export const sendNotificationToTopic = async (title, body, topic = "updates") => {
  const message = {
    notification: { title, body },
    topic,
  };

  const response = await admin.messaging().send(message);
  return response; // FCM message ID
};

// Subscribe a token to a topic
export const subscribeTokenToTopic = async (token, topic = "updates") => {
  if (!token) throw new Error("Token is required");
  return await admin.messaging().subscribeToTopic(token, topic);
};
