export class Match2 {
  constructor(obj) {
    this.columns = obj.columns;
    this.rows = obj.rows;
    this.items = obj.items;
  }

  generateGrid() {
    this.gameArray = [];

    for (let i = 0; i < this.columns; i++) {
      this.gameArray[i] = [];
      for(let j = 0; j < this.rows; j++){
        this.gameArray[i][j] = {
          column: i,
          row: j
        }
      }
    }
  }

  // Returns number of board columns
  getColumns(){
    return this.columns;
  }

  // Returns number of board rows
  getRows(){
    return this.rows;
  }

  // Returns tile at specific col, row
  getTile(col, row) {
    if (!this.validPick(col, row)) {
      return false
    }
    return this.gameArray[col][row];
  }

  // Determines if selection falls within board area
  validPick(col, row) {
    return col >= 0 && row >= 0 && row < this.rows && this.gameArray[col] !== undefined && this.gameArray[col][row] !== undefined;
  }

  // Reset the processed flag on a tile
  resetProcessed() {
    for (let i = 0; i < this.gameArray.length; i++) {
      for(let j = 0; j < this.rows; j++){
        this.gameArray[i][j].processed = false;
      }
    }
  }

  // Find adjacent neighbors of a specific sprite based on col, row
  getNeighbors(col, row) {
    let neighbors = [];

    let top = this.getTile(col, row - 1);
    let right = this.getTile(col + 1, row);
    let bottom = this.getTile(col, row + 1);
    let left = this.getTile(col - 1, row);

    if (top) neighbors.push(top);
    if (right) neighbors.push(right);
    if (bottom) neighbors.push(bottom);
    if (left) neighbors.push(left);

    return neighbors;
  }

  // Checking for clusters to determine which gems are destroyed
  findCluster(targetCol, targetRow, reset) {
    if (reset) {
      this.resetProcessed();
    }

    // Target of click
    let target = this.gameArray[targetCol][targetRow];

    // Add target to array to process
    let toProcess = [target];
    target.processed = true;

    // Array to store tiles that are part of cluster
    let cluster = [];

    while (toProcess.length > 0) {
      let currentTile = toProcess.pop();

      // Skip empty tiles
      if (currentTile.empty) {
        continue;
      }

      // Check if current tile has correct value; push to cluster if so
      if (currentTile.sprite.value === target.sprite.value) {
        cluster.push(currentTile);

        // Check neighbors of currentTile and add to toProcess array
        let neighbors = this.getNeighbors(currentTile.column, currentTile.row);

        for (let i = 0; i < neighbors.length; i++) {
          if (!neighbors[i].processed) {
            toProcess.push(neighbors[i]);
            neighbors[i].processed = true;
          }
        }
      }
    }

    return cluster;
  }
}