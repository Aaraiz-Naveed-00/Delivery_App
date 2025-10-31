import "dotenv/config";
import appJson from './app.json';

export default {
  ...appJson,
  expo: {
     ...appJson.expo,
    name: "Delivery_App",
    slug: "Delivery_App",
    extra: {
      ...appJson.expo.extra,
         eas: {
        projectId: "bf137e10-6faa-453e-abb1-acc028276086", // ✅ Add manually
      },
      EXPO_GOOGLE_CLIENT_ID: process.env.EXPO_GOOGLE_CLIENT_ID,
      EXPO_FACEBOOK_APP_ID: process.env.EXPO_FACEBOOK_APP_ID,
    },
  },
};
