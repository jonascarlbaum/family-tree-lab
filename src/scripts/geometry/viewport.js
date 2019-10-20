import Point from "./point";
import Dimensions from "./dimensions";

export default class Viewport {
  constructor(center, dimensions) {
    this.x = center.x;
    this.y = center.y;

    this.top = center.y - dimensions.height / 2;
    this.right = center.x + dimensions.width / 2;
    this.bottom = center.y + dimensions.height / 2;
    this.left = center.x - dimensions.width / 2;
  }

  static From(rect) {
    return new Viewport(rect.getCenter(), rect.dimensions.clone())
  }

  scale(scale, i) {
    return new Viewport(this.center, this.getDimensions().scale(scale));
  }

  getCenter() {
    return new Point(this.x, this.y);
  }

  getDimensions() {
    return new Dimensions(this.right - this.left, this.bottom - this.top);
  }

  toString() {
    return `(${this.left}, ${this.top})(${this.right}, ${this.bottom})`;
  }
}