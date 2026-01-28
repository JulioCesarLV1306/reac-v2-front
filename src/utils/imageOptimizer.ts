// Utilidad para optimizar la carga de imágenes

export const preloadImage = (src: string): void => {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

export const lazyLoadImage = (img: HTMLImageElement): void => {
  if ('loading' in HTMLImageElement.prototype) {
    img.loading = 'lazy';
  } else {
    // Fallback para navegadores que no soportan loading="lazy"
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            if (image.dataset.src) {
              image.src = image.dataset.src;
              observer.unobserve(image);
            }
          }
        });
      });
      observer.observe(img);
    }
  }
};
