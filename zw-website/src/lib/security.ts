export function sanitizePlainText(input: unknown, maxLength: number) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isPhone(value: string) {
  return /^(?:\+?86[- ]?)?1[3-9]\d{9}$|^(?:0\d{2,3}-?)?\d{7,8}$/.test(value);
}
