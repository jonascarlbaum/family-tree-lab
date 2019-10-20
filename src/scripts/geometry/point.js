export default class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  translate(x, y) {
    this.x += x;
    this.y += y;

    return this;
  }

  scale(scale) {
    this.x *= scale;
    this.y *= scale;

    return this;
  }

  inverse() {
    this.x *= -1;
    this.y *= -1;

    return this;
  }
}