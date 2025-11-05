const fs = require('fs');

const googleServicesBase64 = process.env.GOOGLE_SERVICES_JSON || process.env.GOOGLE_SERVICES_JSON_BASE64;

if (!googleServicesBase64) {
  console.error("❌ GOOGLE_SERVICES_JSON environment variable is missing!");
  process.exit(1);
}

const googleServicesJson = Buffer.from(googleServicesBase64, 'base64').toString('utf8');

// Write file to project root
fs.writeFileSync('google-services.json', googleServicesJson);
console.log('✅ google-services.json file created successfully.');
