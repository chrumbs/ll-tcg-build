export const renderGlobe = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { cos, sin, sqrt, acos, atan2, abs, PI } = Math;
  const clamp = (a, b, x) => (x < a ? a : x > b ? b : x);

  const NB_SECTIONS = 12;
  const LINE_WIDTH = 1;
  const SCALE = devicePixelRatio;
  const BASE_SPEED = 20000; // Base animation speed

  // Get responsive dimensions from canvas
  function updateCanvasDimensions() {
    const rect = canvas.getBoundingClientRect();
    const { width, height } = rect;

    canvas.width = width * SCALE;
    canvas.height = height * SCALE;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const RADIUS = Math.min(width, height) / 2;
    return { width, height, RADIUS };
  }

  let { width, height, RADIUS } = updateCanvasDimensions();

  const vec = (x = 0, y = 0, z = 0) => ({ x, y, z });
  vec.set = (o, x = 0, y = 0, z = 0) => {
    o.x = x;
    o.y = y;
    o.z = z;
    return o;
  };

  const Z = vec(0, 0, 1);
  let theta, phi;

  function project(o, { x, y, z }) {
    const ct = cos(theta),
      st = sin(theta);
    const cp = cos(phi),
      sp = sin(phi);
    const a = x * ct + y * st;
    return vec.set(o, y * ct - x * st, cp * z - sp * a, cp * a + sp * z);
  }

  const _p = vec();
  function draw_section(n, o = 0) {
    if (!ctx) return;
    const { x, y, z } = project(_p, n);
    const a = atan2(y, x);
    const ry = sqrt(1 - o * o);
    const rx = ry * abs(z);
    const W = sqrt(x * x + y * y);
    const sa = acos(clamp(-1, 1, (o * (1 / W - W)) / rx));
    const sb = z > 0 ? 2 * PI - sa : -sa;

    ctx.beginPath();
    ctx.ellipse(x * o * RADIUS, y * o * RADIUS, rx * RADIUS, ry * RADIUS, a, sa, sb, z <= 0);
    ctx.stroke();
  }

  const _n = vec();
  function draw_arcs() {
    for (let i = NB_SECTIONS; i--; ) {
      const a = (i / NB_SECTIONS) * Math.PI;
      draw_section(vec.set(_n, cos(a), sin(a)));
    }

    for (let i = NB_SECTIONS - 1; i--; ) {
      const a = ((i + 1) / NB_SECTIONS) * Math.PI;
      draw_section(Z, cos(a));
    }
  }

  ctx.lineCap = 'round';

  function render() {
    if (!ctx) return;
    requestAnimationFrame(render);

    // Update dimensions
    const newDimensions = updateCanvasDimensions();
    width = newDimensions.width;
    height = newDimensions.height;
    RADIUS = newDimensions.RADIUS;

    // Simple rotation based on time
    theta = (performance.now() / BASE_SPEED) * PI;
    phi = PI * 0.1;

    // Render globe
    ctx.save();
    ctx.scale(SCALE, SCALE);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate((3 * PI) / 180);
    ctx.scale(1, -1);

    ctx.strokeStyle = '#2b46f5';
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.arc(0, 0, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = '#2b46f5';
    draw_arcs();

    // Add gradient overlay to soften edges
    // ctx.globalCompositeOperation = 'destination-out';
    // const gradient = ctx.createRadialGradient(0, 0, RADIUS * 0.5, 0, 0, RADIUS);
    // gradient.addColorStop(0, 'transparent');
    // gradient.addColorStop(0.8, 'transparent');
    // gradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');

    // ctx.fillStyle = gradient;
    // ctx.beginPath();
    // ctx.arc(0, 0, RADIUS + 10, 0, 2 * Math.PI);
    // ctx.fill();

    // ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    updateCanvasDimensions();
  });

  requestAnimationFrame(render);
};
