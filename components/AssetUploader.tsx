'use client';

import { DragEvent, useCallback, useRef, useState } from 'react';

export type UploadedAsset = {
  id: string;
  name: string;
  type: string;
  size: number;
  isImage: boolean;
  /** Base64 data-URL thumbnail (images: resized JPEG; non-images: SVG placeholder) */
  thumbnail: string;
  /** Session-only object URL for crisp preview — not persisted */
  objectUrl?: string;
};

type AssetUploaderProps = {
  assets: UploadedAsset[];
  onChange: (assets: UploadedAsset[]) => void;
  maxFiles?: number;
};

const ACCEPT = 'image/*,application/pdf,image/svg+xml,.ai,.eps,.psd';
const MAX_DIM = 400; // thumbnail max width/height
const THUMB_QUALITY = 0.72;

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function buildThumbnail(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) return fileTypePlaceholder(file.name, file.type);

  return new Promise((resolve) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX_DIM || h > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(objUrl);
      resolve(canvas.toDataURL('image/jpeg', THUMB_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(fileTypePlaceholder(file.name, file.type));
    };
    img.src = objUrl;
  });
}

function fileTypePlaceholder(name: string, mimeType: string): string {
  const ext = name.split('.').pop()?.toUpperCase() ?? 'FILE';
  const color =
    mimeType === 'application/pdf'
      ? '#E53E3E'
      : mimeType.includes('svg')
        ? '#DD6B20'
        : '#6B46C1';
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="12" fill="${color}" opacity=".12"/><rect x="56" y="30" width="88" height="110" rx="8" fill="${color}" opacity=".22"/><rect x="56" y="30" width="88" height="110" rx="8" fill="none" stroke="${color}" stroke-width="2" opacity=".5"/><text x="100" y="164" font-family="system-ui,sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="${color}">${ext}</text></svg>`)}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function processFiles(files: FileList | File[]): Promise<UploadedAsset[]> {
  const list = Array.from(files);
  return Promise.all(
    list.map(async (file): Promise<UploadedAsset> => {
      const isImage = file.type.startsWith('image/');
      const thumbnail = await buildThumbnail(file);
      const objectUrl = isImage ? URL.createObjectURL(file) : undefined;
      return { id: uid(), name: file.name, type: file.type, size: file.size, isImage, thumbnail, objectUrl };
    }),
  );
}

export function AssetUploader({ assets, onChange, maxFiles = 20 }: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  const add = useCallback(
    async (files: FileList | File[]) => {
      if (!files.length) return;
      const remaining = maxFiles - assets.length;
      if (remaining <= 0) return;
      const slice = Array.from(files).slice(0, remaining);
      setProcessing(true);
      const newAssets = await processFiles(slice);
      setProcessing(false);
      onChange([...assets, ...newAssets]);
    },
    [assets, onChange, maxFiles],
  );

  const remove = useCallback(
    (id: string) => {
      const asset = assets.find((a) => a.id === id);
      if (asset?.objectUrl) URL.revokeObjectURL(asset.objectUrl);
      onChange(assets.filter((a) => a.id !== id));
    },
    [assets, onChange],
  );

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    add(e.dataTransfer.files);
  }

  return (
    <div className="au-root">
      {/* Drop zone */}
      <div
        className={`au-zone${dragging ? ' au-zone-active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="au-input"
          onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ''; }}
        />
        {processing ? (
          <div className="au-spinner-wrap">
            <span className="au-spinner" />
            Processing…
          </div>
        ) : (
          <>
            <svg className="au-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0-4 4m4-4 4 4" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            <span className="au-label">
              {dragging ? 'Drop files here' : 'Drag & drop or click to upload'}
            </span>
            <span className="au-hint">Logo · product photos · references · PDF · SVG · up to {maxFiles} files</span>
          </>
        )}
      </div>

      {/* File grid */}
      {assets.length > 0 && (
        <div className="au-grid">
          {assets.map((asset) => (
            <div key={asset.id} className="au-item">
              {/* Preview */}
              <div className="au-preview">
                <img src={asset.objectUrl ?? asset.thumbnail} alt={asset.name} />
                {!asset.isImage && <span className="au-type-badge">{asset.name.split('.').pop()?.toUpperCase()}</span>}
              </div>

              {/* Meta */}
              <div className="au-meta">
                <span className="au-name" title={asset.name}>{asset.name}</span>
                <span className="au-size">{formatBytes(asset.size)}</span>
              </div>

              {/* Remove */}
              <button
                type="button"
                className="au-remove"
                title="Remove"
                onClick={(e) => { e.stopPropagation(); remove(asset.id); }}
                aria-label={`Remove ${asset.name}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6 18 18M6 18 18 6" />
                </svg>
              </button>
            </div>
          ))}

          {/* Add-more tile */}
          {assets.length < maxFiles && (
            <button type="button" className="au-add-more" onClick={() => inputRef.current?.click()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add more
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const assetUploaderCss = `
/* ─── Asset Uploader ─────────────────────────────────────── */
.au-root { display: grid; gap: 14px; }

.au-zone {
  border: 1.5px dashed rgba(21,32,26,.35);
  border-radius: 12px;
  background: rgba(21,32,26,.025);
  padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer;
  transition: border-color .15s, background .15s;
  text-align: center;
  position: relative;
  outline: none;
}
.au-zone:hover, .au-zone:focus-visible { border-color: var(--signal); background: rgba(221,74,20,.04); }
.au-zone-active { border-color: var(--signal); background: rgba(221,74,20,.07); }

.au-input { position: absolute; inset: 0; opacity: 0; width: 100%; height: 100%; cursor: pointer; display: none; }

.au-icon { width: 26px; height: 26px; color: var(--mute); flex-shrink: 0; }
.au-label { font-size: 14px; font-weight: 500; color: var(--ink); }
.au-hint  { font-family: var(--mono); font-size: 10.5px; letter-spacing: .07em; color: var(--mute); }

.au-spinner-wrap { display: flex; align-items: center; gap: 10px; color: var(--mute); font-size: 13.5px; }
.au-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(21,32,26,.18);
  border-top-color: var(--signal);
  border-radius: 50%;
  animation: au-spin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes au-spin { to { transform: rotate(360deg); } }

/* Grid of uploaded files */
.au-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.au-item {
  position: relative;
  background: var(--paper);
  border: 1px solid rgba(21,32,26,.18);
  border-radius: 10px;
  overflow: hidden;
  display: flex; flex-direction: column;
}

.au-preview {
  aspect-ratio: 1/1;
  position: relative;
  background: rgba(21,32,26,.04);
  overflow: hidden;
}
.au-preview img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}
.au-type-badge {
  position: absolute; bottom: 5px; left: 5px;
  font-family: var(--mono); font-size: 9px; font-weight: 700;
  padding: 2px 5px; border-radius: 4px;
  background: rgba(255,255,255,.9); color: var(--ink);
  letter-spacing: .06em;
}

.au-meta {
  padding: 6px 8px;
  display: grid; gap: 1px;
}
.au-name {
  font-size: 11px; font-weight: 500; color: var(--ink);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: block;
}
.au-size {
  font-family: var(--mono); font-size: 9.5px; color: var(--mute);
  letter-spacing: .04em;
}

.au-remove {
  position: absolute; top: 5px; right: 5px;
  width: 20px; height: 20px;
  border-radius: 50%; border: 0;
  background: rgba(21,32,26,.72);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity .15s;
  padding: 0;
}
.au-remove svg { width: 10px; height: 10px; }
.au-item:hover .au-remove { opacity: 1; }

.au-add-more {
  aspect-ratio: 1/1;
  border: 1.5px dashed rgba(21,32,26,.3);
  border-radius: 10px;
  background: transparent;
  color: var(--mute);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
  font-size: 11px; font-weight: 500;
  cursor: pointer;
  transition: border-color .15s, color .15s, background .15s;
}
.au-add-more:hover { border-color: var(--signal); color: var(--signal); background: rgba(221,74,20,.04); }
.au-add-more svg { width: 16px; height: 16px; }
`;
