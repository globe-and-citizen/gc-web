import eventBus from '@/utils/eventBus';

let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let percentage: number = 0;

export function triggerRainingEffect(routeName: string) {
  if (canvas) return;

  canvas = document.createElement('canvas');
  canvas.classList.add('fade-in');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVXYZ'.split('');
  const fontSize = 10;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);

  eventBus.on('loading-percentage', (newPercentage) => {
    percentage = newPercentage;
  });

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0 - Math.random() * 10;
      }
    }

    if (routeName === 'home' && percentage === 0) {
      canvas.style.animation = 'none';
    } else {
      ctx.font = '48px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(`${percentage}%`, canvas.width / 2, canvas.height / 2);
        
      const barWidth = canvas.width * 0.6;
      const barHeight = 15;
      const barX = (canvas.width - barWidth) / 2;
      const barY = canvas.height / 2 + 50;

      ctx.fillStyle = '#555';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      ctx.fillStyle = '#0f0';
      ctx.fillRect(barX, barY, (barWidth * percentage) / 100, barHeight);
    }
  }

  intervalId = setInterval(draw, 33);
}

export function stopRainingEffect() {
  if (canvas) {
    canvas.classList.remove('fade-in');
    canvas.classList.add('fade-out');

    // I am using setTimeout() because it matches the duration of the fade-out animation (1 second),
    // allowing the animation to complete smoothly before the element is removed
    setTimeout(() => {
      document.body.removeChild(canvas);
      canvas = null;
      percentage = 0;
    }, 2000);
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
