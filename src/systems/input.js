export function createInput(win) {
  const keys = new Set();
  const pressed = new Set();

  const onDown = (e) => {
    const k = normalizeKey(e.key);
    keys.add(k);
    pressed.add(k);
  };
  const onUp = (e) => {
    const k = normalizeKey(e.key);
    keys.delete(k);
  };
  win.addEventListener('keydown', onDown);
  win.addEventListener('keyup', onUp);

  return {
    isDown: (k) => keys.has(normalizeKey(k)),
    wasPressed: (k) => {
      const key = normalizeKey(k);
      const had = pressed.has(key);
      pressed.delete(key);
      return had;
    },
    destroy() {
      win.removeEventListener('keydown', onDown);
      win.removeEventListener('keyup', onUp);
    }
  };
}

function normalizeKey(k) {
  switch (k) {
    case 'ArrowLeft': return 'left';
    case 'ArrowRight': return 'right';
    case 'ArrowUp': return 'up';
    case 'ArrowDown': return 'down';
    case ' ': return 'jump';
    case 'w': case 'W': return 'up';
    case 'a': case 'A': return 'left';
    case 's': case 'S': return 'down';
    case 'd': case 'D': return 'right';
    case 'r': case 'R': return 'reset';
    default: return k;
  }
}

