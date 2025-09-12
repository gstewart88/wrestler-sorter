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
      if (!ref.current) return;
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

  return { exportRef };
}
