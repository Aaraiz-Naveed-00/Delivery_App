import 'dotenv/config';
import appJson from './app.json';

export default ({ config }) => ({
  ...config, // ✅ use values from Expo's internal config (fixes warning)
  ...appJson, // ✅ also merge your app.json
  expo: {
    ...config.expo,
    ...appJson.expo,
    name: "Delivery_App",
    slug: "Delivery_App",
    android: {
      ...appJson.expo.android,
      // Use EAS file env var in CI; fallback to local path for dev
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./android/app/google-services.json",
    },
    extra: {
      ...appJson.expo.extra,
      eas: {
        projectId: "bf137e10-6faa-453e-abb1-acc028276086",
      },
      EXPO_GOOGLE_CLIENT_ID: process.env.EXPO_GOOGLE_CLIENT_ID,
      EXPO_FACEBOOK_APP_ID: process.env.EXPO_FACEBOOK_APP_ID,
    },
  },
});
