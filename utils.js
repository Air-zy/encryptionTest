export function xorBlocks(a, b) {
  const result = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export function randomBytes(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}
