export const mouseState = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

window.addEventListener('mousemove', (e) => {
  mouseState.x = e.clientX;
  mouseState.y = e.clientY;
});
