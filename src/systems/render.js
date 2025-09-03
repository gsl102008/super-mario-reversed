export function createRenderer(ctx, canvas) {
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawWorld(world) {
    const t = world.tileSize;
    for (let y = 0; y < world.tiles.length; y++) {
      for (let x = 0; x < world.tiles[y].length; x++) {
        const v = world.tiles[y][x];
        if (v === 0) continue;
        const screenX = Math.floor(x * t - world.camera.x);
        const screenY = Math.floor(y * t - world.camera.y);
        ctx.fillStyle = v === 1 ? '#4d7c0f' : '#78350f';
        ctx.fillRect(screenX, screenY, t, t);
      }
    }
    // Goal flag
    const gx = Math.floor(world.goal.x * t - world.camera.x);
    const gy = Math.floor(world.goal.y * t - world.camera.y);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gx + t/2 - 2, gy - 48, 4, 48);
    ctx.fillStyle = '#ff2d55';
    ctx.beginPath();
    ctx.moveTo(gx + t/2 + 2, gy - 48);
    ctx.lineTo(gx + t/2 + 38, gy - 36);
    ctx.lineTo(gx + t/2 + 2, gy - 24);
    ctx.closePath();
    ctx.fill();
  }

  function drawPlayer(player, camera) {
    const x = Math.floor(player.pos.x - camera.x);
    const y = Math.floor(player.pos.y - camera.y);
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(x, y, player.size.w, player.size.h);
    // Eyes
    ctx.fillStyle = '#111827';
    ctx.fillRect(x + 8, y + 8, 6, 6);
    ctx.fillRect(x + player.size.w - 14, y + 8, 6, 6);
  }

  function drawHUD(state) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, 200, 60);
    ctx.fillStyle = '#d9e1ff';
    ctx.font = '14px system-ui';
    ctx.fillText(`World: ${state.worldName}`, 12, 20);
    ctx.fillText(`Lives: ${state.lives}`, 12, 38);
    ctx.fillText(`Time: ${Math.max(0, Math.ceil(state.timer))}`, 12, 56);
  }

  return {
    draw(state) {
      clear();
      drawWorld(state.world);
      drawPlayer(state.player, state.world.camera);
      drawHUD(state);
    }
  };
}

