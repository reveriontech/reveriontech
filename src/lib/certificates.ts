const certModules = import.meta.glob<string>('../assets/lanyard/certs/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
});

function pathToCertId(filePath: string): string {
  const name = filePath.split('/').pop() ?? '';
  return name.replace(/\.pdf$/i, '');
}

const certUrlById: Record<string, string> = {};
for (const [path, url] of Object.entries(certModules)) {
  certUrlById[pathToCertId(path)] = url;
}

export function normalizeCertId(raw: string | undefined): string {
  if (!raw) return '';
  return decodeURIComponent(raw).replace(/\.pdf$/i, '').trim();
}

export function getCertificatePdfUrl(certId: string): string | undefined {
  return certUrlById[normalizeCertId(certId)];
}
