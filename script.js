import { utf8Encode, utf8Decode } from './utf8module.js';
import { base64Encode, base64Decode } from './base64module.js';

import { encrypt as aesEncryptBlock, decrypt as aesDecryptBlock } from './aes-128_ecb.js';

window.runEncode = function () {
  const input = document.getElementById("input").value;
  const start = performance.now();

  try {
    const bytes = utf8Encode(input);
    const encoded = base64Encode(bytes);
    const end = performance.now();
    document.getElementById("encoded").value = encoded;
    document.getElementById("timing").textContent = `Encoding took ${(end - start).toFixed(2)} ms`;
  } catch (e) {
    document.getElementById("encoded").value = "[Error]";
    document.getElementById("timing").textContent = `Encoding error: ${e.message}`;
  }
};

window.runDecode = function () {
  const encoded = document.getElementById("encoded").value;
  const start = performance.now();

  try {
    const bytes = base64Decode(encoded);
    const decoded = utf8Decode(bytes);
    const end = performance.now();
    document.getElementById("decoded").value = decoded;
    document.getElementById("timing").textContent = `Decoding took ${(end - start).toFixed(2)} ms`;
  } catch (e) {
    document.getElementById("decoded").value = "[Decode Error]";
    document.getElementById("timing").textContent = `Decoding failed: ${e.message}`;
  }
};

function hexToBytes(hexStr) {
  let hex = hexStr.trim().toLowerCase();
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  hex = hex.replace(/[^0-9a-f]/g, '');
  if (hex.length !== 32) {
    throw new Error("Key must be exactly 32 hex characters (16 bytes)");
  }
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    const byteHex = hex.slice(i * 2, i * 2 + 2);
    const val = parseInt(byteHex, 16);
    if (Number.isNaN(val)) {
      throw new Error("Invalid hex in key");
    }
    bytes[i] = val;
  }
  return bytes;
}

window.runAesEncrypt = function () {
  const keyHex = document.getElementById("aes-key").value;
  const plaintext = document.getElementById("aes-plaintext").value;
  const outCipherEl = document.getElementById("aes-ciphertext");
  const timingEl = document.getElementById("aes-timing");

  const start = performance.now();
  try {
    const keyBytes = hexToBytes(keyHex);
    const plainBytes = utf8Encode(plaintext);
    // aesEncryptBlock here is the encrypt function from aes-128_ecb.js
    const cipherBytes = aesEncryptBlock(keyBytes, plainBytes);
    const cipherB64 = base64Encode(cipherBytes);
    const end = performance.now();

    outCipherEl.value = cipherB64;
    timingEl.textContent = `AES Encrypt took ${(end - start).toFixed(2)} ms`;
  } catch (e) {
    outCipherEl.value = "";
    timingEl.textContent = `AES Encrypt error: ${e.message}`;
  }
};

window.runAesDecrypt = function () {
  const keyHex = document.getElementById("aes-key").value;
  const cipherB64In = document.getElementById("aes-ciphertext-in").value;
  const outPlainEl = document.getElementById("aes-decrypted");
  const timingEl = document.getElementById("aes-timing");

  const start = performance.now();
  try {
    const keyBytes = hexToBytes(keyHex);
    const cipherBytes = base64Decode(cipherB64In);
    const plainBytes = aesDecryptBlock(keyBytes, cipherBytes);
    const plaintext = utf8Decode(plainBytes);
    const end = performance.now();

    outPlainEl.value = plaintext;
    timingEl.textContent = `AES Decrypt took ${(end - start).toFixed(2)} ms`;
  } catch (e) {
    outPlainEl.value = "";
    timingEl.textContent = `AES Decrypt error: ${e.message}`;
  }
};
