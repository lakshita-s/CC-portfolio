class Maze {
  constructor(grid, config = {}) {
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;
    this.cellW = width / this.cols;
    this.cellH = height / this.rows;

    this.wallColor = config.wallColor;
    this.glowColor = config.glowColor;

    if (config.startCell) {
      const { col, row } = config.startCell;
      this.startX = (col + 0.5) * this.cellW;
      this.startY = (row + 0.5) * this.cellH;
    }

    if (config.goalCell) {
      const { col, row } = config.goalCell;
      this.goal = {
        x: (col + 0.5) * this.cellW,
        y: (row + 0.5) * this.cellH
      };
    }

    //collect the dots(Stars)
    this.dots = [];
    if (config.dotCells && Array.isArray(config.dotCells)) {
      for (let d of config.dotCells) {
        if (this.grid[d.row][d.col] === 0) {
          this.dots.push({
            x: (d.col + 0.5) * this.cellW,
            y: (d.row + 0.5) * this.cellH,
            collected: false
          });
        }
      }
    }
  }

  display() {
    noStroke();
    
    //draw walls
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) {
          const x = c * this.cellW;
          const y = r * this.cellH;
          
          // Glow
          fill(this.glowColor.r, this.glowColor.g, this.glowColor.b, this.glowColor.a);
          rect(x - 2, y - 2, this.cellW + 4, this.cellH + 4, 3);
          
          // Solid wall
          fill(this.wallColor.r, this.wallColor.g, this.wallColor.b, this.wallColor.a);
          rect(x, y, this.cellW, this.cellH, 3);
        }
      }
    }

    //draw the dots
    for (let dot of this.dots) {
      if (!dot.collected) {
        imageMode(CENTER);
        const d = min(this.cellW, this.cellH) * 0.6;
        image(collectImg, dot.x, dot.y, d, d);
      }
    }

    //goal
    stroke(255);
    strokeWeight(4);
    noFill();
    const g = min(this.cellW, this.cellH) * 0.6;
    ellipse(this.goal.x, this.goal.y, g);
    noStroke();
  }

  isValidPosition(x, y, playerW, playerH) {
    const pts = [
      { x: x - playerW / 2, y: y - playerH / 2 },
      { x: x + playerW / 2, y: y - playerH / 2 },
      { x: x - playerW / 2, y: y + playerH / 2 },
      { x: x + playerW / 2, y: y + playerH / 2 },
      { x, y: y - playerH / 2 },
      { x, y: y + playerH / 2 },
      { x: x - playerW / 2, y },
      { x: x + playerW / 2, y }
    ];

    for (let p of pts) {
      const col = floor(p.x / this.cellW);
      const row = floor(p.y / this.cellH);
      if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return false;
      if (this.grid[row][col] === 1) return false;
    }
    return true;
  }

  checkDotCollection(px, py) {
    const radius = min(this.cellW, this.cellH) * 0.4;
    for (let dot of this.dots) {
      if (!dot.collected && dist(px, py, dot.x, dot.y) < radius) {
        dot.collected = true;
      }
    }
  }

  checkWin(px, py) {
    const threshold = min(this.cellW, this.cellH) * 0.4;
    return dist(px, py, this.goal.x, this.goal.y) < threshold;
  }
}