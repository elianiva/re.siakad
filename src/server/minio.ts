import { Client } from "minio";
import { env } from "~/env.mjs";

export const minioClient = new Client({
	accessKey: env.MINIO_ACCESS_KEY,
	secretKey: env.MINIO_SECRET_KEY,
	endPoint: env.MINIO_ENDPOINT,
	port: env.MINIO_PORT,
	useSSL: env.NODE_ENV === "production",
});
