function decodeBase64(string) {
  return atob(string);
}

function getLength(value) {
  return value.length;
}

function buildByteArray(string, stringLength) {
  const buffer = new ArrayBuffer(stringLength);
  const array = new Uint8Array(buffer);
  for (let i = 0; i < stringLength; i++) { array[i] = string.charCodeAt(i); }
  return array;
}

function createBlob(byteArray) {
  return new Blob([byteArray], { type: 'application/pdf' });
}

export function base64ToBlob(base64String) {
  const decodedString = decodeBase64(base64String),
    decodedStringLength = getLength(decodedString),
    byteArray = buildByteArray(decodedString, decodedStringLength);
  return byteArray ? createBlob(byteArray) : null;
}
