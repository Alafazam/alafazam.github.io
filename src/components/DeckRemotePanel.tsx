import { useEffect, useState } from 'react';
import type { HostStatus } from '../remote/useDeckRemoteHost';

interface DeckRemotePanelProps {
  status: HostStatus;
  pairingUrl: string | null;
  error: string | null;
  onRetry: () => void;
  onStop: () => void;
  onClose: () => void;
}

// Pixel width of the QR image; large enough to scan from a couple of metres.
const QR_SIZE_PX = 240;

const STATUS_TEXT: Record<HostStatus, string> = {
  off: 'Remote is off.',
  starting: 'Starting the remote…',
  waiting: 'Scan with your phone camera to pair.',
  connected: 'Phone connected. Swipe on the phone to move slides.',
  error: "Can't reach the remote relay. Retrying…",
};

// Overlay inside the deck (so it also shows in full screen) with the pairing QR code.
const DeckRemotePanel = ({ status, pairingUrl, error, onRetry, onStop, onClose }: DeckRemotePanelProps) => {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    setQrDataUrl(null);
    if (!pairingUrl) return;
    let cancelled = false;
    import('qrcode')
      .then((qr) => qr.toDataURL(pairingUrl, { width: QR_SIZE_PX, margin: 1 }))
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch((e: unknown) => console.error('[deck-remote] could not draw the QR code', e));
    return () => {
      cancelled = true;
    };
  }, [pairingUrl]);

  return (
    <div className="deck-remote-panel" role="dialog" aria-label="Phone remote">
      <div className="deck-remote-card">
        <h2>Phone remote</h2>
        <p className="deck-remote-status" aria-live="polite">
          {STATUS_TEXT[status]}
        </p>
        {status === 'error' && error && <p className="deck-remote-error">{error}</p>}
        {qrDataUrl && pairingUrl && status !== 'error' && (
          <>
            <img src={qrDataUrl} width={QR_SIZE_PX} height={QR_SIZE_PX} alt="QR code that opens the phone remote" />
            <a className="deck-remote-link" href={pairingUrl} target="_blank" rel="noreferrer">
              {pairingUrl}
            </a>
          </>
        )}
        <div className="deck-remote-actions">
          {status === 'error' && (
            <button type="button" className="btn-primary" onClick={onRetry}>
              Try again
            </button>
          )}
          {status !== 'off' && (
            <button type="button" className="btn-outline" onClick={onStop}>
              Stop remote
            </button>
          )}
          <button type="button" className="btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckRemotePanel;
