import { createCipheriv, randomInt } from "crypto";

/**
 * ZEGOCLOUD Token04.
 * Binary layout matches the public server assistant: expire, iv, AES-256-CBC payload.
 * The server secret never leaves this module.
 */
export function generateToken04(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload = "",
) {
  if (!Number.isInteger(appId) || appId <= 0) {
    throw new Error("ZEGO_APP_ID is not a valid App ID.");
  }
  if (!userId) throw new Error("userId invalid");
  if (secret.length !== 32) throw new Error("ZEGO_SERVER_SECRET must be 32 characters.");
  if (!Number.isFinite(effectiveTimeInSeconds) || effectiveTimeInSeconds <= 0) {
    throw new Error("token lifetime invalid");
  }

  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: randomInt(-2147483648, 2147483647),
    ctime: createTime,
    expire: createTime + Math.floor(effectiveTimeInSeconds),
    payload: payload || "",
  };
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let iv = "";
  for (let i = 0; i < 16; i += 1) iv += alphabet[randomInt(0, alphabet.length)];

  const cipher = createCipheriv("aes-256-cbc", Buffer.from(secret), Buffer.from(iv));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(tokenInfo), "utf8"), cipher.final()]);
  const packed = Buffer.alloc(8 + 2 + iv.length + 2 + encrypted.length);
  let offset = 0;
  packed.writeBigInt64BE(BigInt(tokenInfo.expire), offset);
  offset += 8;
  packed.writeUInt16BE(iv.length, offset);
  offset += 2;
  packed.write(iv, offset, "utf8");
  offset += iv.length;
  packed.writeUInt16BE(encrypted.length, offset);
  offset += 2;
  encrypted.copy(packed, offset);
  return `04${packed.toString("base64")}`;
}
