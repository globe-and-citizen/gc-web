let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let style: HTMLStyleElement | null = null;

export const startRainingEffect = () => {
    console.log("called")
  if (intervalId) return;

  canvas = document.createElement('canvas');
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1s ease';
  document.body.appendChild(canvas);

  style = document.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; }
    canvas { 
      display: block; 
      height: 100vh; 
      width: 100%; 
      position: absolute; 
      top: 0; 
      left: 0; 
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');
  const fontSize = 10;
  const columns = Math.floor(canvas.width / fontSize);
  if (columns <= 0) return;

  const drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#0f0';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      drops[i]++;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0 - Math.random() * 10; 
      }
    }
  }

  intervalId = setInterval(draw, 33);

  setTimeout(() => {
    if (canvas) canvas.style.opacity = '1';
  }, 0);
};

export const stopRainingEffect = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    if (canvas) {
        canvas.style.opacity = '0';

        setTimeout(() => {
        if (canvas) {
            document.body.removeChild(canvas);
            canvas = null;
        }
        }, 1000);
    }

    // if (style) {
    //     document.head.removeChild(style);
    //     style = null;
    // }
};
