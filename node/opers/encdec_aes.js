// const crypto = require("crypto");
import crypto from "crypto"

// Function to encrypt data
function encrypt(text, key) {
  // Generate a random initialization vector
  const iv = "003e4fbd5235013d7615be8ac5987e66";
  // Create cipher with AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Return both the encrypted data and the IV
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}


// Function to decrypt data
function decrypt(encryptedData, iv, key) {
  // Create decipher
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    Buffer.from(iv, 'hex')
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}