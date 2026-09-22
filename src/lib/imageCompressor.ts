/**
 * Mobil ve masaüstü cihazlardan yüklenen fotoğrafları optimize eder.
 * Dosya boyutunu küçülterek tarayıcı ve sunucu belleğini korur.
 */
export async function compressImageFile(file: File, maxWidth = 1280, quality = 0.82): Promise<{ dataUrl: string; sizeStr: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: event.target?.result as string, sizeStr: formatFileSize(file.size) });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // JPEG veya WebP olarak sıkıştır
        const outputType = file.type === 'image/png' && file.size < 500 * 1024 ? 'image/png' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(outputType, quality);
        
        // Yaklaşık boyut hesabı
        const head = outputType === 'image/png' ? 'data:image/png;base64,' : 'data:image/jpeg;base64,';
        const approxBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);

        resolve({
          dataUrl: compressedDataUrl,
          sizeStr: formatFileSize(approxBytes)
        });
      };
      img.onerror = () => {
        resolve({ dataUrl: event.target?.result as string, sizeStr: formatFileSize(file.size) });
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
