export default class TestMiniMapRenderer {
  constructor() {
    //only log stuff here, to be read by tests
    this.actions = [];
  }

  setBackgroundImage(dataUrl) {
    this.actions.push('set-mini-map-background-image');
  }
}