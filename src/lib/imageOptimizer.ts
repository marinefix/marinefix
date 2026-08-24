export async function compressImage(file: File, maxWidth = 1280, quality = 0.75): Promise<File> {
    // If it's a PDF, do not compress
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      return file;
    }
  
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
  
        img.onload = () => {
          let width = img.width;
          let height = img.height;
  
          // Resize down proportionally if image is larger than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
  
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file); // Fallback to original
            return;
          }
  
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to lightweight WebP format
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const compressedFile = new File([blob], cleanName, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/webp",
            quality
          );
        };
  
        img.onerror = () => resolve(file);
      };
  
      reader.onerror = () => resolve(file);
    });
  }