import { useCallback, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import { getCertificatePdfUrl, normalizeCertId } from '@/lib/certificates';
import { Button } from '@/components/ui/Button';

export function CertificatePage() {
  const { certId: certIdParam } = useParams<{ certId: string }>();
  const certId = normalizeCertId(certIdParam);
  const pdfUrl = certId ? getCertificatePdfUrl(certId) : undefined;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const verifyUrl = useMemo(() => {
    if (typeof window === 'undefined' || !certId) return '';
    return `${window.location.origin}/cert/${certId}`;
  }, [certId]);

  const filename = `${certId || 'certificate'}.pdf`;

  const handlePrint = useCallback(() => {
    if (!pdfUrl) return;
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      return;
    }
    const w = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    w?.addEventListener('load', () => w.print(), { once: true });
  }, [pdfUrl]);

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [filename, pdfUrl]);

  if (!certId || !pdfUrl) {
    return (
      <div className="certificate-page certificate-page--empty">
        <div className="certificate-page__panel">
          <h1 className="certificate-page__title">Certificate not found</h1>
          <p className="certificate-page__muted">
            This link may be incorrect or the certificate is not available. Contact ReverionTech if you believe this is
            an error.
          </p>
          <Button to="/" variant="outline">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <div className="certificate-page__toolbar no-print">
        <div className="certificate-page__toolbar-inner">
          <div>
            <h1 className="certificate-page__title">Your certificate</h1>
            <p className="certificate-page__muted">
              Verification ID: <code className="certificate-page__code">{certId}</code>
            </p>
            <p className="certificate-page__verify">
              Verifiable at:{' '}
              <Link to={`/cert/${certId}`} className="certificate-page__verify-link">
                {verifyUrl}
              </Link>
            </p>
          </div>
          <div className="certificate-page__actions">
            <Button type="button" variant="primary" onClick={handleDownload}>
              <Download size={18} aria-hidden />
              Download PDF
            </Button>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer size={18} aria-hidden />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="certificate-page__frame-wrap">
        <iframe
          ref={iframeRef}
          title={`Certificate ${certId}`}
          src={pdfUrl}
          className="certificate-page__frame"
        />
      </div>

      <style>{`
        .certificate-page {
          --cert-pad: clamp(1rem, 4vw, 2rem);
          min-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          background: var(--color-bg);
        }
        .certificate-page--empty {
          align-items: center;
          justify-content: center;
          padding: var(--cert-pad);
        }
        .certificate-page__panel {
          max-width: 32rem;
          text-align: center;
        }
        .certificate-page__toolbar {
          border-bottom: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
          padding: var(--cert-pad);
          background: var(--color-bg);
        }
        .certificate-page__toolbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          align-items: flex-start;
          justify-content: space-between;
        }
        .certificate-page__title {
          font-size: clamp(1.35rem, 3vw, 1.75rem);
          margin-bottom: 0.35rem;
        }
        .certificate-page__muted {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }
        .certificate-page__code {
          font-size: 0.85em;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          background: color-mix(in srgb, var(--color-text) 8%, transparent);
        }
        .certificate-page__verify {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          word-break: break-all;
          margin-top: 0.5rem;
        }
        .certificate-page__verify-link {
          font-weight: 500;
        }
        .certificate-page__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          align-items: center;
        }
        .certificate-page__frame-wrap {
          flex: 1;
          min-height: 70vh;
          padding: 0 var(--cert-pad) var(--cert-pad);
        }
        .certificate-page__frame {
          width: 100%;
          height: min(85vh, 900px);
          border: 1px solid color-mix(in srgb, var(--color-text) 15%, transparent);
          border-radius: var(--radius-md, 8px);
          background: var(--color-bg);
        }
        @media print {
          .no-print { display: none !important; }
          .certificate-page__frame-wrap { padding: 0; }
          .certificate-page__frame {
            height: 100vh;
            border: none;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
}
