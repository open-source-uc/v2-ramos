/// <reference types="astro/client" />

type Env = {
	DB: D1Database;
	R2: R2Bucket;
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface ImportMetaEnv {
	readonly MODE_ENV: "development" | "production";
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals extends Runtime { }
}