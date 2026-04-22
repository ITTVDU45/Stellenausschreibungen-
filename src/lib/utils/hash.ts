export function buildDuplicateHash(title: string, companyName: string, location: string) {
  return `${title}-${companyName}-${location}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}
