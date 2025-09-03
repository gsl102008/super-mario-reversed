export function createPhysics() {
  const gravity = 1800;
  const maxFall = 2200;
  const frictionGround = 0.86;
  const frictionAir = 0.98;

  function aabbVsTile(pos, size, tileRect) {
    const dx = (pos.x + size.w / 2) - (tileRect.x + tileRect.w / 2);
    const dy = (pos.y + size.h / 2) - (tileRect.y + tileRect.h / 2);
    const px = (size.w / 2 + tileRect.w / 2) - Math.abs(dx);
    const py = (size.h / 2 + tileRect.h / 2) - Math.abs(dy);
    if (px <= 0 || py <= 0) return null;
    if (px < py) {
      return { axis: 'x', sign: Math.sign(dx), overlap: px };
    } else {
      return { axis: 'y', sign: Math.sign(dy), overlap: py };
    }
  }

  function applyWorldCollision(entity, tiles, tileSize) {
    const size = { w: entity.size.w, h: entity.size.h };
    const pos = { x: entity.pos.x, y: entity.pos.y };
    const bounds = {
      left: Math.floor(pos.x / tileSize),
      right: Math.floor((pos.x + size.w) / tileSize),
      top: Math.floor(pos.y / tileSize),
      bottom: Math.floor((pos.y + size.h) / tileSize)
    };
    const collisions = [];
    for (let ty = bounds.top - 1; ty <= bounds.bottom + 1; ty++) {
      for (let tx = bounds.left - 1; tx <= bounds.right + 1; tx++) {
        const tile = tiles[ty]?.[tx];
        if (!tile || tile === 0) continue;
        const rect = { x: tx * tileSize, y: ty * tileSize, w: tileSize, h: tileSize };
        const res = aabbVsTile(pos, size, rect);
        if (res) collisions.push({ ...res, rect, tx, ty });
      }
    }
    collisions.sort((a, b) => a.overlap - b.overlap);
    let onGround = false;
    for (const c of collisions) {
      if (c.axis === 'x') {
        entity.pos.x += c.overlap * (c.sign > 0 ? 1 : -1);
        entity.vel.x = 0;
      } else {
        entity.pos.y += c.overlap * (c.sign > 0 ? 1 : -1);
        if (c.sign > 0) onGround = true;
        entity.vel.y = 0;
      }
    }
    entity.onGround = onGround;
  }

  return {
    updatePlayer(player, world, dt) {
      const speed = 260;
      const jumpV = 720;
      if (player.controls.left) player.vel.x -= speed * dt;
      if (player.controls.right) player.vel.x += speed * dt;

      player.vel.y += gravity * dt;
      if (player.vel.y > maxFall) player.vel.y = maxFall;

      player.pos.x += player.vel.x * dt;
      applyWorldCollision(player, world.tiles, world.tileSize);

      player.pos.y += player.vel.y * dt;
      applyWorldCollision(player, world.tiles, world.tileSize);

      const friction = player.onGround ? frictionGround : frictionAir;
      player.vel.x *= friction;
      if (Math.abs(player.vel.x) < 0.01) player.vel.x = 0;

      if (player.controls.jump && player.onGround) {
        player.vel.y = -jumpV;
        player.onGround = false;
      }
    }
  };
}

