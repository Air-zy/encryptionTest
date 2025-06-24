export function utf8Encode(str) {
  let bytes = [];
  for (const char of str) {
    const codePoint = char.codePointAt(0);
    if (codePoint <= 0x7F) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7FF) {
      bytes.push(
        0b11000000 | (codePoint >> 6),
        0b10000000 | (codePoint & 0b00111111)
      );
    } else if (codePoint <= 0xFFFF) {
      bytes.push(
        0b11100000 | (codePoint >> 12),
        0b10000000 | ((codePoint >> 6) & 0b00111111),
        0b10000000 | (codePoint & 0b00111111)
      );
    } else {
      bytes.push(
        0b11110000 | (codePoint >> 18),
        0b10000000 | ((codePoint >> 12) & 0b00111111),
        0b10000000 | ((codePoint >> 6) & 0b00111111),
        0b10000000 | (codePoint & 0b00111111)
      );
    }
  }
  return bytes;
}

export function utf8Decode(bytes) {
  let result = "", i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i];
    if (b1 < 0x80) {
      result += String.fromCodePoint(b1);
      i += 1;
    } else if (b1 < 0xE0) {
      const b2 = bytes[i + 1];
      result += String.fromCodePoint(((b1 & 0x1F) << 6) | (b2 & 0x3F));
      i += 2;
    } else if (b1 < 0xF0) {
      const b2 = bytes[i + 1], b3 = bytes[i + 2];
      result += String.fromCodePoint(((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F));
      i += 3;
    } else {
      const b2 = bytes[i + 1], b3 = bytes[i + 2], b4 = bytes[i + 3];
      result += String.fromCodePoint(((b1 & 0x07) << 18) | ((b2 & 0x3F) << 12) | ((b3 & 0x3F) << 6) | (b4 & 0x3F));
      i += 4;
    }
  }
  return result;
}
