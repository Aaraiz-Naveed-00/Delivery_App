const fs = require("fs");
const path = require("path");

const dest = path.join(process.cwd(), "android", "app", "google-services.json");

function ensureDir(filePath) {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(content) {
	ensureDir(dest);
	fs.writeFileSync(dest, content);
	console.log(`Wrote google-services.json to ${dest}`);
}

try {
	if (process.env.GOOGLE_SERVICES_JSON) {
		const val = process.env.GOOGLE_SERVICES_JSON;
		if (fs.existsSync(val)) {
			const content = fs.readFileSync(val);
			writeFile(content);
			process.exit(0);
		}
		if (val.trim().startsWith("{")) {
			writeFile(val);
			process.exit(0);
		}
	}

	if (process.env.GOOGLE_SERVICES_JSON_BASE64) {
		const base64 = process.env.GOOGLE_SERVICES_JSON_BASE64;
		const buf = Buffer.from(base64, "base64");
		writeFile(buf);
		process.exit(0);
	}

	if (fs.existsSync(dest)) {
		console.log("google-services.json already present. Skipping setup.");
		process.exit(0);
	}

	console.warn(
		"GOOGLE_SERVICES_JSON/GOOGLE_SERVICES_JSON_BASE64 not provided and file not present. If building on EAS, create a file secret."
	);
} catch (e) {
	console.error("Failed to set up google-services.json", e);
	process.exit(1);
}


