import type {Entity, RectT} from './Entity';
import type {MoveStateT} from './Tank';

export class Zone {
  width = 0;
  height = 0;
  matrix: Array<Array<Entity | null>>;
  constructor({width, height}: Pick<Zone, 'width' | 'height'>) {
    this.width = width;
    this.height = height;
    this.buildMatrix();
  }
  buildMatrix() {
    this.matrix = Array(this.width);
    for (let x = 0; x < this.matrix.length; ++x) {
      this.matrix[x] = Array(this.height).fill(null);
    }
  }
  updateMatrix(rect: RectT, value: Entity | null) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        this.matrix[x][y] = value;
      }
    }
  }
  writeEntityToMatrix(entity: Entity) {
    if (entity.alignedToGrid) {
      this.updateMatrix(entity.getRect(), entity);
    }
  }
  deleteEntityFromMatrix(entity: Entity) {
    if (entity.alignedToGrid) {
      this.updateMatrix(entity.lastRect, null);
    }
  }
  registerEntity(entity: Entity) {
    entity.on('entityWillMove', (moveState: MoveStateT) => {
      if (this.hasCollision(entity)) {
        moveState.hasCollision = true;
      } else {
        if (entity.alignedToGrid) {
          this.updateMatrix(entity.nextRect, entity);
        }
      }
    });
    entity.on('entityShouldUpdate', () => {
      this.deleteEntityFromMatrix(entity);
    });
    entity.on('entityDidUpdate', () => {
      this.writeEntityToMatrix(entity);
    });
  }
  isBeyondXAxis(rect: RectT) {
    const offsetX = rect.posX + rect.width;
    if (rect.posX < 0 || offsetX > this.width) {
      return true;
    }
    return false;
  }
  isBeyondYAxis(rect: RectT) {
    const offsetY = rect.posY + rect.height;
    if (rect.posY < 0 || offsetY > this.height) {
      return true;
    }
    return false;
  }
  hasCollisionsWithMatrix(rect: RectT, entity: Entity) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        const cell = this.matrix[x][y];
        if (cell !== entity && cell !== null && !cell.crossable) {
          return true;
        }
      }
    }
    return false;
  }
  hasCollision(entity: Entity) {
    const rect = entity.nextRect;
    if (this.isBeyondXAxis(rect) || this.isBeyondYAxis(rect)) {
      return true;
    }
    if (this.hasCollisionsWithMatrix(rect, entity)) {
      return true;
    }
    return false;
  }
}
