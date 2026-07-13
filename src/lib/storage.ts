import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 is S3-API-compatible, so the same AWS SDK client works for it -
 * just point S3_ENDPOINT at your R2 account endpoint. R2 is recommended over
 * raw AWS S3 here because it has no egress (bandwidth) fees, which matters a
 * lot for a video site serving Rwanda/Africa where every GB streamed costs.
 */
const s3 = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Returns a short-lived URL the browser can PUT a file to directly, so large
 * video files never have to pass through our own server.
 */
export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 minutes
  const publicUrl = `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
  return { uploadUrl, publicUrl };
}

/**
 * If you'd rather not run your own transcoding pipeline for adaptive bitrate
 * (360p/480p/720p/1080p), Cloudflare Stream does that automatically and gives
 * you an HLS manifest URL instead - swap this module for direct calls to
 * https://api.cloudflare.com/client/v4/accounts/{account_id}/stream when ready.
 */
