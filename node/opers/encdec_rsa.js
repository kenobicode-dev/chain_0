// const crypto = require("crypto");
import crypto from "crypto"

// Encrypt with public key
export function encrypt(text, publicKey) {
    // publicKey = publicKey.replace(/\\n/g, '\n');
    publicKey = publicKey.replace(/\\n/gm, "\n")
    
  const buffer = Buffer.from(text);
  const encrypted = crypto.publicEncrypt({ key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, buffer);
  return encrypted.toString('base64');
}

// Decrypt with private key
export function decrypt(encryptedText, privateKey) {
  const buffer = Buffer.from(encryptedText);
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}