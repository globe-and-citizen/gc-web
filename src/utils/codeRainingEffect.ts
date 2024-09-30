let intervalId: number | null = null;
let canvas: HTMLCanvasElement | null = null;
let style: HTMLStyleElement | null = null;
let loadingText: HTMLDivElement | null = null;
let loadingPercentage = 0;

export const handleCodeRainingEffect = (value: boolean) => {
  if (value) {
    if (intervalId) return;   

    loadingPercentage = 0;

    // Create canvas
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    // Inject styles
    style = document.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; }
      body { background: #000; }
      #app { display: none; }
      canvas { display: block; }
      .loading-style {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 48px;
        font-family: monospace;
        opacity: 1;
        animation: fadeIn 1s forwards;
      }
    `;
    document.head.appendChild(style);

    // Create loading text
    loadingText = document.createElement('div');
    loadingText.className = 'loading-style';
    loadingText.textContent = `Loading... ${loadingPercentage}%`;
    document.body.appendChild(loadingText);

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize);
    if (columns <= 0) return;

    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (canvas.height / fontSize)));

    // Drawing function
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, .1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
          drops[i] = 0;
        }
      }

      if (loadingPercentage < 100) {
        loadingPercentage++;
        if (loadingText) {
          loadingText.textContent = `Loading... ${loadingPercentage}%`;
        }
      }
    }

    intervalId = window.setInterval(draw, 11);
  } else {
    // Cleanup the effect
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (canvas) {
      document.body.removeChild(canvas);
      canvas = null;
    }
    if (style) {
      document.head.removeChild(style);
      style = null;
    }
    if (loadingText) {
    //   loadingText.style.animation = 'fadeOut 1s forwards';
      loadingText.addEventListener('animationend', () => {
        if (loadingText) {
          document.body.removeChild(loadingText);
          loadingText = null;
        }
      });
    }
  }
};
