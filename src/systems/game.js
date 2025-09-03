export function createGame({ input, physics, renderer, levels, startIndex }) {
  const state = {
    input,
    physics,
    renderer,
    levels,
    currentIndex: startIndex,
    lives: 3,
    timer: 300,
    world: null,
    player: null,
    worldName: ''
  };

  function loadWorld(index) {
    const def = state.levels[index];
    state.worldName = def.name;
    state.world = {
      tileSize: def.tileSize,
      tiles: def.tiles.map(row => row.slice()),
      camera: { x: 0, y: 0 },
      width: def.tiles[0].length * def.tileSize,
      height: def.tiles.length * def.tileSize,
      goal: def.goal
    };
    state.player = {
      pos: { x: def.spawn.x * def.tileSize, y: def.spawn.y * def.tileSize },
      vel: { x: 0, y: 0 },
      size: { w: def.tileSize * 0.8, h: def.tileSize * 0.95 },
      onGround: false,
      controls: { left: false, right: false, jump: false }
    };
    state.timer = 300;
  }

  function updateControls() {
    const p = state.player;
    p.controls.left = state.input.isDown('left');
    p.controls.right = state.input.isDown('right');
    p.controls.jump = state.input.isDown('jump') || state.input.isDown('up');
  }

  function updateCamera() {
    const w = state.world;
    const p = state.player;
    const targetX = p.pos.x + p.size.w / 2 - 960 / 2;
    const targetY = p.pos.y + p.size.h / 2 - 540 / 2;
    w.camera.x += (targetX - w.camera.x) * 0.1;
    w.camera.y += (targetY - w.camera.y) * 0.1;
    w.camera.x = Math.max(0, Math.min(w.camera.x, w.width - 960));
    w.camera.y = Math.max(0, Math.min(w.camera.y, w.height - 540));
  }

  function checkGoal() {
    const w = state.world;
    const p = state.player;
    const t = w.tileSize;
    const gx = w.goal.x * t;
    const gy = w.goal.y * t;
    const reached = p.pos.x + p.size.w > gx && p.pos.x < gx + t && p.pos.y + p.size.h > gy - t && p.pos.y < gy + t;
    if (reached) {
      // Move backwards: 8->7->...->1
      if (state.currentIndex + 1 < state.levels.length) {
        state.currentIndex += 1;
        loadWorld(state.currentIndex);
      } else {
        // Loop or show win
        state.currentIndex = state.levels.length - 1;
      }
    }
  }

  function checkDeath(dt) {
    const p = state.player;
    const w = state.world;
    state.timer -= dt;
    if (p.pos.y > w.height + 200 || state.timer <= 0) {
      state.lives -= 1;
      if (state.lives < 0) {
        // reset to first backwards world (8)
        state.lives = 3;
        state.currentIndex = 0;
      }
      loadWorld(state.currentIndex);
    }
  }

  loadWorld(state.currentIndex);

  return {
    update(dt) {
      if (state.input.wasPressed('reset')) loadWorld(state.currentIndex);
      updateControls();
      state.physics.updatePlayer(state.player, state.world, dt);
      updateCamera();
      checkGoal();
      checkDeath(dt);
    },
    draw() {
      state.renderer.draw({
        world: state.world,
        player: state.player,
        worldName: state.worldName,
        lives: state.lives,
        timer: state.timer
      });
    }
  };
}

