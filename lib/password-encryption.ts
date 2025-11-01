import crypto from "crypto";

// Encryption algorithm
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 16 bytes for AES
const TAG_LENGTH = 16; // 16 bytes for GCM auth tag
const KEY_LENGTH = 32; // 32 bytes for AES-256

/**
 * Get the encryption key from environment variable
 * If not set, generate a key (but warn in production)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.PASSWORD_ENCRYPTION_KEY;

  if (!key) {
    // In production, this should always be set
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "PASSWORD_ENCRYPTION_KEY environment variable is required in production"
      );
    }
    // For development, use a default key (NOT SECURE - only for dev)
    console.warn(
      "⚠️  WARNING: PASSWORD_ENCRYPTION_KEY not set. Using default key (NOT SECURE for production!)"
    );
    // Derive a 32-byte key from a default string
    return crypto.scryptSync("default-dev-key-rivo-notes", "salt", KEY_LENGTH);
  }

  // Convert hex string to buffer (64 hex chars = 32 bytes)
  if (key.length === 64 && /^[0-9a-fA-F]+$/.test(key)) {
    return Buffer.from(key, "hex");
  }

  // Otherwise, derive a 32-byte key from the string using scrypt
  return crypto.scryptSync(key, "rivo-notes-salt-v1", KEY_LENGTH);
}

/**
 * Encrypt a password using AES-256-GCM
 * Returns a base64 encoded string containing: iv + tag + encryptedData
 */
export function encryptPassword(password: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(password, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const tag = cipher.getAuthTag();

    // Combine: iv + tag + encrypted data
    const combined = Buffer.concat([iv, tag, encrypted]);

    // Return as base64 for easy storage
    return combined.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt password");
  }
}

/**
 * Decrypt a password using AES-256-GCM
 * Expects a base64 encoded string containing: iv + tag + encryptedData
 */
export function decryptPassword(encryptedPassword: string): string {
  try {
    const key = getEncryptionKey();

    // Decode from base64
    const combined = Buffer.from(encryptedPassword, "base64");

    // Extract components
    let offset = 0;
    const iv = combined.slice(offset, offset + IV_LENGTH);
    offset += IV_LENGTH;

    const tag = combined.slice(offset, offset + TAG_LENGTH);
    offset += TAG_LENGTH;

    const encrypted = combined.slice(offset);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt password");
  }
}
