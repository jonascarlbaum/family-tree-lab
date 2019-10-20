import html2canvas from 'html2canvas';
import panzoom from 'panzoom';

import Dimensions from './geometry/dimensions';
import Rectangle from './geometry/rectangle';
import Point from './geometry/point';
import Viewport from './geometry/viewport';

export default class TreeController {
  constructor(treeRenderer, miniMapRenderer) {
    this.treeRenderer = treeRenderer;
    this.miniMapRenderer = miniMapRenderer;
    this.panzoomInstance = null;
  }

  generateMiniMapBackgroundImage(treeElement, containerElement) {
    return new Promise((resolve, reject) => {
      try {
        const elementWidth = treeElement.clientWidth;
        containerElement.setAttribute('style', 'position: fixed; overflow: hidden;');
        treeElement.setAttribute('style', `transform: scale(${200 / (elementWidth + 400)});`);

        html2canvas(treeElement, { backgroundColor: 'rgba(255,255,255,0)'}).then((canvas) => {
          containerElement.removeAttribute('style');
          treeElement.removeAttribute('style');
          this.miniMapRenderer.setBackgroundImage(canvas.toDataURL("image/png"));
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  initiateMiniMap(treeElement, containerElement, minimap) {
    const elementWidth = treeElement.clientWidth;
    const elementHeight = treeElement.clientHeight;
    const wrapperWidth = containerElement.clientWidth;
    const wrapperHeight = wrapperWidth * 9 / 16;

    const minMargin = 10;

    const zoom1 = (wrapperWidth - minMargin * 2) / elementWidth;
    const zoom2 = (wrapperHeight - minMargin * 2) / elementHeight;

    const zoom = Math.min(zoom1, zoom2);

    const x = (wrapperWidth - elementWidth * zoom) / 2;
    const y = (wrapperHeight - elementHeight * zoom) / 2;

    this.panzoomInstance = panzoom(treeElement, {
      maxZoom: 1,
      minZoom: 0.1
    });

    this.panzoomInstance.zoomAbs(
      x, // initial x position
      y, // initial y position
      zoom  // initial zoom 
    );

    this.panzoomInstance.on('panstart', (e) => { });
    this.panzoomInstance.on('pan', (e) => { });
    this.panzoomInstance.on('panend', (e) => { });
    this.panzoomInstance.on('zoom', (e) => { });

    this.panzoomInstance.on('transform', (e) => {
      this.update(treeElement, containerElement, minimap, e);      
    });

    this.update(treeElement, containerElement, minimap);
  }

  update(tree, container, minimap, e) {
    this.treeRenderer.update(tree, container);
    //this.miniMapRenderer.update(minimap, tree, container);

    const transform = this.panzoomInstance.getTransform();

    // // const percentWidth = wrapperWidth / (elementWidth * transform.scale) * 100;
    // // const percentHeight = percentWidth;

    const elementRect = Rectangle.From(tree.getBoundingClientRect());
    const wrapperRect = Rectangle.From(container.getBoundingClientRect());


    const elementWidth = parseInt(tree.clientWidth, 10);
    const elementHeight = parseInt(tree.clientHeight, 10);
    const wrapperWidth = parseInt(container.clientWidth, 10);
    const wrapperHeight = wrapperWidth * 9 / 16;

    const zoom1 = wrapperWidth  / elementWidth;
    const zoom2 = wrapperHeight / elementHeight;

    const zoom = Math.min(zoom1, zoom2);
    const scaleRelativeToMiniMapScale = zoom / transform.scale;
    
    const miniMapWidth = 200;
    const miniMapHeight = miniMapWidth / 16 * 9;

    const transformCenterX = transform.x + elementRect.dimensions.width / 2;
    const transformCenterY = transform.y + elementRect.dimensions.height / 2;

    const width1 = elementRect.dimensions.width;
    const width2 = elementRect.dimensions.height / 9*16;
    const width = Math.max(width1, width2);
    
    const height1 = elementRect.dimensions.width / 16*9;
    const height2 = elementRect.dimensions.height;
    const height = Math.max(height1, height2);

    const miniMapScene = new Viewport(
      new Point(transformCenterX, transformCenterY),
      new Dimensions(width, height)
    );

    const widthDiff = miniMapScene.getDimensions().width - elementRect.dimensions.width;
    const heightDiff = miniMapScene.getDimensions().height - elementRect.dimensions.height;

    this.miniMapRenderer.setViewport(
      new Viewport(
        new Point(
          50 + widthDiff / 2 / miniMapScene.getDimensions().width * 100 
          - transform.x / miniMapScene.getDimensions().width * 100,
          50 + heightDiff / 2 / miniMapScene.getDimensions().height * 100
             - transform.y / miniMapScene.getDimensions().height * 100
          // - transformCenterX / wrapperRect.dimensions.width,
          // - transformCenterY / wrapperRect.dimensions.height
         ),
        // miniMapScene.getCenter(),
        new Dimensions((scaleRelativeToMiniMapScale) * 100, (scaleRelativeToMiniMapScale) * 100)
      )
    );
  }

  setTreeCenter(center) {
    // this.treeCenter = center;
    // this.treeRenderer.moveTo(center);

    this.panzoomInstance.moveTo(center.x, center.y);
    this.update();
  }

  disposeMiniMap = (tree, container) => {
    if (!!this.panzoomInstance) {
      this.panzoomInstance.dispose();
      tree.removeAttribute('style');
      container.removeAttribute('style');
    }
  }
}