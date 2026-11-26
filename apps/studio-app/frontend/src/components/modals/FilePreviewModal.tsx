import React, { useEffect } from 'react';
import { Download, ExternalLink, FileText, X } from 'lucide-react';
import type { LocalFileEntry } from '../../utils/localFileStore';
import { openLocalFileInNewTab } from '../../utils/localFileStore';
import { formatByteSize, truncateSha256 } from '../../utils/fileIngestion';
import { useI18n } from '../../context/I18nContext';

export interface FilePreviewModalProps {
  entry: LocalFileEntry | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ entry, onClose }) => {
  const { tr } = useI18n();

  useEffect(() => {
    if (!entry) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [entry, onClose]);

  if (!entry) return null;

  const lowerName = entry.fileName.toLowerCase();
  const isPdf = entry.mimeType === 'application/pdf' || lowerName.endsWith('.pdf');
  const isImage = entry.family === 'image' || entry.mimeType.startsWith('image/');
  const isAudio = entry.family === 'audio' || entry.mimeType.startsWith('audio/');
  const isVideo = entry.family === 'video' || entry.mimeType.startsWith('video/');
  const isHtml = entry.family === 'web_osint' || entry.mimeType === 'text/html' || lowerName.endsWith('.html');
  const isCsv = Boolean(entry.csvRows && entry.csvRows.length > 0);
  const isText = Boolean(entry.textPreview && !isHtml);

  return (
    <div
      className="file-preview-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={tr('Visualisation du fichier')}
      onClick={onClose}
    >
      <div className="file-preview-modal" onClick={(e) => e.stopPropagation()}>
        <header className="file-preview-header">
          <div className="file-preview-title-group">
            <FileText size={16} aria-hidden="true" />
            <div className="file-preview-title-meta">
              <h3 className="file-preview-title">
                <bdi dir="ltr">{entry.fileName}</bdi>
              </h3>
              <bdi dir="ltr" className="file-preview-sub">
                {formatByteSize(entry.size)} · {entry.mimeType} · SHA-256: {truncateSha256(entry.sha256)}
              </bdi>
            </div>
          </div>

          <div className="file-preview-actions">
            {entry.blobUrl && (
              <button
                type="button"
                className="btn btn-secondary btn-sm file-preview-action-btn"
                onClick={() => openLocalFileInNewTab(entry)}
              >
                <ExternalLink size={13} aria-hidden="true" />
                <span>{tr('Nouvel onglet')}</span>
              </button>
            )}
            {entry.blobUrl && (
              <a
                className="btn btn-ghost btn-sm file-preview-action-btn"
                href={entry.blobUrl}
                download={entry.fileName}
              >
                <Download size={13} aria-hidden="true" />
                <span>{tr('Télécharger')}</span>
              </a>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              aria-label={tr('Fermer')}
              title={tr('Fermer')}
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="file-preview-body">
          {isImage && entry.blobUrl && (
            <img className="file-preview-image" src={entry.blobUrl} alt={entry.fileName} />
          )}

          {isAudio && entry.blobUrl && (
            <div className="file-preview-media-box">
              <audio className="file-preview-audio" controls src={entry.blobUrl} />
            </div>
          )}

          {isVideo && entry.blobUrl && (
            <video className="file-preview-video" controls src={entry.blobUrl} />
          )}

          {isPdf && entry.blobUrl && (
            <iframe className="file-preview-pdf" src={entry.blobUrl} title={entry.fileName} />
          )}

          {isHtml && (
            <iframe
              className="file-preview-html"
              sandbox=""
              srcDoc={entry.textPreview || ''}
              title={entry.fileName}
            />
          )}

          {isCsv && entry.csvRows && (
            <div className="file-preview-table-wrap">
              <div className="file-preview-csv-badge">
                {tr('Aperçu CSV ({shown} / {total} lignes)', {
                  shown: entry.csvRows.length,
                  total: entry.csvTotalRows ?? entry.csvRows.length,
                })}
              </div>
              <table className="file-preview-table">
                <thead>
                  <tr>
                    {(entry.csvRows[0] ?? []).map((col, idx) => (
                      <th key={idx}>
                        <bdi dir="ltr">{col}</bdi>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entry.csvRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>
                          <bdi dir="ltr">{cell}</bdi>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isText && <pre className="file-preview-pre"><bdi dir="ltr">{entry.textPreview}</bdi></pre>}

          {!isImage && !isAudio && !isVideo && !isPdf && !isHtml && !isCsv && !isText && (
            <div className="file-preview-binary-box">
              <p className="file-preview-binary-note">
                {tr("Aperçu binaire direct limité aux 64 premiers octets. Utilisez « Nouvel onglet » ou « Télécharger » pour l'ouvrir dans une application externe.")}
              </p>
              {entry.hexHeader && (
                <pre className="file-preview-pre">
                  <bdi dir="ltr">{entry.hexHeader}</bdi>
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
