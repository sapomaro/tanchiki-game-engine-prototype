import {Entity} from './Entity';

export class Terrain extends Entity {
  constructor(props: Pick<Entity, 'width' | 'height' | 'type'>) {
    super(props);
    this.type = props.type;
    this.role = 'neutral';
    switch (this.type) {
      case 'brickWall':
        this.crossable = false;
        this.color = 'brown';
        break;
      case 'trees':
        this.crossable = true;
        this.hittable = false;
        this.color = 'green';
        break;
      case 'water':
        this.crossable = false;
        this.hittable = false;
        this.color = 'blue';
        break;
    }
  }
}
