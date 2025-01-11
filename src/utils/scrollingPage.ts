let scrollInterval: number | null = null;

export const startScroll = (stopCallback?: () => void) => {
  scrollInterval = window.setInterval(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.body.scrollHeight;

    if (scrollPosition >= pageHeight) {
      stopScroll();
      if (stopCallback) {
        stopCallback();
      }
    } else {
      window.scrollBy(0, 2);
    }
  }, 16);
};

export const stopScroll = () => {
  clearInterval(scrollInterval);
  scrollInterval = null;
};

export const isScrolling = () => scrollInterval !== null;
