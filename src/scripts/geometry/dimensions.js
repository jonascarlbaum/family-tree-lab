export default class Dimensions {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  clone() {
    return new Dimensions(this.width, this.height);
  }
}