export default class DefaultTreeRenderer {
  constructor() {
  }

  update(tree, container) {
    const containerWidth = parseInt(container.clientWidth, 10);
    container.setAttribute('style', 'height: ' + containerWidth * 9 / 16 + "px");
  }
}