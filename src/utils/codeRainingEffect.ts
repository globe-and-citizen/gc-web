let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;

export function triggerRainingEffect() {
  if (canvas) return;

  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');
  const fontSize = 10;
  const columns = Math.floor(canvas.width / fontSize);
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

  // setTimeout(() => {
  //   document.body.removeChild(canvas);
  //   canvas = null;
  //   clearInterval(intervalId);
  // }, 3000);
}

export function stopRainingEffect() {
  if (canvas) {
      document.body.removeChild(canvas);
      canvas = null;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      } 
  }
}
