// src/hooks/useHtml2CanvasExport.js

import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export default function useHtml2CanvasExport() {
  const downloadBlob = useCallback((blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download= filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportRef = useCallback(
    async (ref, opts = {}, filename = 'export.png') => {
      if (!ref.current) {
        console.warn('Nothing to export—missing ref.');
        return;
      }
      const canvas = await html2canvas(ref.current, {
        useCORS:    true,
        allowTaint: false,
        scale:      2,
        ...opts
      });
      canvas.toBlob(blob => blob && downloadBlob(blob, filename));
    },
    [downloadBlob]
  );

  const shareRef = useCallback(
    async (ref, opts = {}, filename = 'export.png', shareMeta = {}) => {
      if (!ref.current) {
        console.warn('Nothing to share—missing ref.');
        return;
      }
      // 1. render canvas
      const canvas = await html2canvas(ref.current, {
        useCORS:    true,
        allowTaint: false,
        scale:      1,
        ...opts,
      });

      // 2. to Blob
      canvas.toBlob(async blob => {
        if (!blob) return;

        // wrap in File for Web Share API
        const file = new File([blob], filename, { type: blob.type });

        // 3. native share if available
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: shareMeta.title,
              text:  shareMeta.text,
            });
            return;
          } catch (err) {
            // if user cancelled, err.name === 'AbortError' → do nothing
            if (err.name === 'AbortError') {
              return;
            }
            console.warn('Share API error, falling back to download', err);
          }
        }

        // 4. fallback download
        downloadBlob(blob, filename);
      });
    },
    [downloadBlob],
  );

  return { exportRef, shareRef };
}
