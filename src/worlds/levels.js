const T = 48; // tile size

function makeFlat(width, height) {
  const tiles = Array.from({ length: height }, () => Array(width).fill(0));
  const groundY = height - 2;
  for (let x = 0; x < width; x++) tiles[groundY][x] = 1;
  for (let x = 0; x < width; x++) tiles[groundY + 1][x] = 2;
  return tiles;
}

function addPlatforms(tiles, segments) {
  for (const s of segments) {
    const { x, y, w } = s;
    for (let i = 0; i < w; i++) {
      tiles[y][x + i] = 1;
    }
  }
}

function addPits(tiles, pits) {
  const h = tiles.length;
  for (const p of pits) {
    for (let x = p.x; x < p.x + p.w; x++) {
      tiles[h - 2][x] = 0;
      tiles[h - 1][x] = 0;
    }
  }
}

function worldDef(name, customizer) {
  const width = 80;
  const height = 14;
  const tiles = makeFlat(width, height);
  const spawn = { x: 2, y: height - 4 };
  const goal = { x: width - 4, y: height - 3 };
  customizer?.(tiles, width, height);
  return { name, tileSize: T, tiles, spawn, goal };
}

export const LEVELS = [
  worldDef('World 8', (tiles, w, h) => {
    addPits(tiles, [ { x: 10, w: 4 }, { x: 24, w: 5 }, { x: 46, w: 6 } ]);
    addPlatforms(tiles, [ { x: 15, y: h - 5, w: 3 }, { x: 30, y: h - 7, w: 4 }, { x: 55, y: h - 6, w: 5 } ]);
  }),
  worldDef('World 7', (tiles, w, h) => {
    addPits(tiles, [ { x: 14, w: 3 }, { x: 40, w: 4 } ]);
    addPlatforms(tiles, [ { x: 22, y: h - 6, w: 6 }, { x: 52, y: h - 8, w: 4 } ]);
  }),
  worldDef('World 6', (tiles, w, h) => {
    addPlatforms(tiles, [ { x: 12, y: h - 6, w: 5 }, { x: 28, y: h - 5, w: 4 }, { x: 44, y: h - 7, w: 6 } ]);
  }),
  worldDef('World 5', (tiles, w, h) => {
    addPits(tiles, [ { x: 20, w: 3 } ]);
    addPlatforms(tiles, [ { x: 8, y: h - 6, w: 3 }, { x: 34, y: h - 6, w: 5 } ]);
  }),
  worldDef('World 4', (tiles, w, h) => {
    addPlatforms(tiles, [ { x: 18, y: h - 7, w: 6 } ]);
  }),
  worldDef('World 3', (tiles, w, h) => {
    addPits(tiles, [ { x: 26, w: 2 } ]);
  }),
  worldDef('World 2', (tiles, w, h) => {
    addPlatforms(tiles, [ { x: 12, y: h - 6, w: 3 } ]);
  }),
  worldDef('World 1', (tiles, w, h) => {
    // Gentle start
  })
];

export const START_WORLD_INDEX = 0; // Start at World 8, progress backward to World 1

