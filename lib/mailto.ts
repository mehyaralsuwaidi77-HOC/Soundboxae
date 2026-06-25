export const CONTACT_EMAIL = "info@soundboxdubai.com";

export function createMailtoLink(
  email: string,
  subject?: string,
  body?: string,
): string {
  let url = `mailto:${email}`;
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body)    params.push(`body=${encodeURIComponent(body)}`);
  if (params.length) url += `?${params.join("&")}`;
  return url;
}

export const contactMailto = createMailtoLink(CONTACT_EMAIL);
