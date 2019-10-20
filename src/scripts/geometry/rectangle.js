import Point from "./point";
import Dimensions from "./dimensions";

export default class Rectangle {
  constructor(point, dimensions) {
    this.point = point;
    this.dimensions = dimensions;

    this.x = point.x;
    this.y = point.y;

    this.top = point.y;
    this.right = point.x + dimensions.width ;
    this.bottom = point.y + dimensions.height;
    this.left = point.x;
  }

  static From(r) {
    return new Rectangle(new Point(r.x, r.y), new Dimensions(r.width, r.height));
  }

  static FromCenter(center, dimensions) {
    return new Rectangle(center.clone().translate(-dimensions.width / 2, -dimensions.height / 2), dimensions.clone());
  }

  clone() {
    return new Rectangle(this.point.clone(), this.dimensions.clone());
  }

  getCenter() {
    return new Point(this.point.x + this.dimensions.width / 2, this.point.y + this.dimensions.height / 2);
  }

  translate(point) {
    this.point.x += point.x;
    this.point.y += point.y;

    this.x = this.point.x;
    this.y = this.point.y;
    
    this.top += point.y;
    this.right += point.x;
    this.bottom += point.y;
    this.left += point.x;

    return this;
  }
  
  resetPosition() {
    this.point.x = 0;
    this.point.y = 0;

    return this;
  }

  scaleToBounds(bounds) {
    var scale1 = bounds.width / this.dimensions.width;
    var scale2 = bounds.height / this.dimensions.height;

    var scale = Math.min(scale1, scale2);

    this.dimensions.width *= scale;
    this.dimensions.height *= scale;

    return this;
  }
}