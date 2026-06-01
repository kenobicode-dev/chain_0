// const crypto = require("crypto");
import crypto from "crypto"

// publicKey = publicKey.replace(/\\n/g, '\n');
    // publicKey = publicKey.replace(/\\n/gm, "\n")

// Encrypt with public key
export function encrypt(text, publicKey) {
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey.replace(/\\n/g, '\n'),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    buffer
  );
  return encrypted.toString('base64');
}

// Decrypt with private key
export function decrypt(encryptedText, privateKey) {
  const buffer = Buffer.from(encryptedText, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.replace(/\\n/g, '\n'),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    },
    buffer
  );
  return decrypted.toString('utf8');
}