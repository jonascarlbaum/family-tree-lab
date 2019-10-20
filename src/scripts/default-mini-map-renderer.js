export default class DefaultMiniMapRenderer {
  constructor(map, overlay) {
    this.map = map;
    this.overlay = overlay;
  }

  setBackgroundImage(dataUrl) {
    this.background = dataUrl;
  }


  setViewport(viewport) {
    const miniMapWidth = 200;
    const miniMapHeight = 200/16*9;

    this.overlay.setAttribute('style',
      'width: ' + miniMapWidth + 'px; ' +
      'height: ' + miniMapHeight + 'px;' +
      'clip-path: polygon(0 0, ' +
      '100% 0, ' +
      '100% 100%, ' +
      '0 100%, ' +
      '0 ' + viewport.bottom + '%, ' +
      viewport.right + '% ' + viewport.bottom + '%, ' +
      viewport.right + '% ' + viewport.top + '%, ' +
      viewport.left + '% ' + viewport.top + '%, ' +
      viewport.left + '% ' + viewport.bottom + '%, ' +
      '0 ' + viewport.bottom + '%);');
    this.map.setAttribute('style',
      'background-image: url(' + this.background + '); ' +
      'background-size: contain; ' +
      'background-repeat: no-repeat; ' +
      'background-position-y: 50%; ' +
      'width: ' + miniMapWidth + 'px; ' +
      'height: ' + miniMapHeight + 'px;');
  }
}