import { createGame } from './systems/game.js';
import { createInput } from './systems/input.js';
import { createRenderer } from './systems/render.js';
import { createPhysics } from './systems/physics.js';
import { LEVELS, START_WORLD_INDEX } from './worlds/levels.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const input = createInput(window);
const physics = createPhysics();
const renderer = createRenderer(ctx, canvas);

const game = createGame({ input, physics, renderer, levels: LEVELS, startIndex: START_WORLD_INDEX });

let last = performance.now();
function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000);
  last = t;
  game.update(dt);
  game.draw();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

