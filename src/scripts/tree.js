import html2canvas from 'html2canvas';
import panzoom from 'panzoom';
import Rectangle from './geometry/rectangle';
import TreeController from './tree-controller';
import DefaultTreeRenderer from './default-tree-renderer';
import DefaultMiniMapRenderer from './default-mini-map-renderer';

export default class Tree {
    constructor() {
        this.wrapper = document.querySelector('.tree-wrapper');
        this.element = this.wrapper.querySelector('.tree');
        this.miniMap = this.wrapper.querySelector('figcaption');
        this.miniMapOverlay = this.miniMap.querySelector('code');

        this.treeRenderer = new DefaultTreeRenderer(this);
        this.miniMapRenderer = new DefaultMiniMapRenderer(this.miniMap, this.miniMapOverlay);
        this.controller = new TreeController(this.treeRenderer, this.miniMapRenderer);

        this.mobile = false;
        this.desktop = false;

        this.miniMap.addEventListener('click', (e) => this.handleOverlayClick(e));
        this.miniMap.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.miniMap.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.miniMap.addEventListener('mouseup', (e) => this.handleMouseUpOrOut(e));
        this.miniMap.addEventListener('mouseout', (e) => this.handleMouseUpOrOut(e));

        setTimeout(this.handleResize, 0);
        window.addEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if (!this.mobile && window.innerWidth < 768) {
            this.mobile = true;
            this.desktop = false;
            this.controller.dispose(this.element, this.wrapper);
        } else if (!this.desktop && window.innerWidth >= 768) {
            this.mobile = false;
            this.desktop = true;
            this.controller.generateMiniMapBackgroundImage(this.element, this.wrapper).then(() => {
                this.controller.initiateMiniMap(this.element, this.wrapper, this.miniMap);
            });
        }

        if (this.desktop && window.innerWidth >= 768) {
            if (!!this.controller.panzoomInstance) {
                this.controller.update();
            }
        }
    }

    handleOverlayClick = (e) => {
        e.stopPropagation();

        // TODO: verify these calculations
        const transform = this.controller.panzoomInstance.getTransform();

        // const elementRect = this.element.getBoundingClientRect();

        // const mapCenterX = (elementRect.x + elementRect.width / 2);
        // const mapCenterY = (elementRect.y + elementRect.height / 2);
        // const elementWidth = parseInt(this.element.clientWidth);
        // const elementHeight = parseInt(this.element.clientHeight);
        // const wrapperWidth = parseInt(this.wrapper.clientWidth);
        // const wrapperHeight = parseInt(this.wrapper.clientHeight);

        // const x = (e.offsetX + mapCenterX) * transform.scale;
        const x = e.offsetX / parseInt(this.miniMap.clientWidth, 10) * parseInt(this.element.clientWidth, 10) * transform.scale * -0.5;
        const y = e.offsetY / parseInt(this.miniMap.clientHeight, 10) * parseInt(this.element.clientHeight, 10) * transform.scale * -0.5;

        this.controller.setTreeCenter(x, y);
    }

    handleMouseDown = (e) => {
        e.stopPropagation();
        this.isPanning = true;
    }

    handleMouseMove = (e) => {
        e.stopPropagation();
        if (this.isPanning) {
            this.handleOverlayClick(e);
        }
    }

    handleMouseUpOrOut = (e) => {
        e.stopPropagation();
        this.isPanning = false;
    }

    // initiateMiniMap = () => {
    //     const elementWidth = this.element.clientWidth;
    //     const elementHeight = this.element.clientHeight;
    //     const wrapperWidth = this.wrapper.clientWidth;
    //     const wrapperHeight = wrapperWidth * 9 / 16;

    //     const minMargin = 10;

    //     const zoom1 = (wrapperWidth - minMargin * 2) / elementWidth;
    //     const zoom2 = (wrapperHeight - minMargin * 2) / elementHeight;

    //     const zoom = Math.min(zoom1, zoom2);

    //     const x = (wrapperWidth - elementWidth * zoom) / 2;
    //     const y = (wrapperHeight - elementHeight * zoom) / 2;
    //     //this.wrapper.setAttribute('style', 'position: fixed; overflow: hidden;');
    //     this.element.setAttribute('style', `transform: scale(${200 / (elementWidth + 400)});`);
    //     html2canvas(this.element, { backgroundColor: "rgba(0,0,0,0)" }).then((canvas) => {
    //         this.wrapper.removeAttribute('style');
    //         this.element.removeAttribute('style');
    //         // this.canvas = c;

    //         //todo: scale down to width: 200px, since the background-image is allways presented as width: 200px;
    //         //      https://html2canvas.hertzen.com/configuration/
    //         //      https://stackoverflow.com/a/27847681/2913268
    //         this.minimapBackgroundImage = canvas.toDataURL("image/png");

    //         this.panzoomInstance = panzoom(this.element, {
    //             maxZoom: 1,
    //             minZoom: 0.1
    //         });

    //         this.panzoomInstance.zoomAbs(
    //             x, // initial x position
    //             y, // initial y position
    //             zoom  // initial zoom 
    //         );

    //         this.updateMiniMap();

    //         this.panzoomInstance.on('panstart', (e) => { });
    //         this.panzoomInstance.on('pan', (e) => { });
    //         this.panzoomInstance.on('panend', (e) => { });
    //         this.panzoomInstance.on('zoom', (e) => { });

    //         this.panzoomInstance.on('transform', (e) => {
    //             this.updateMiniMap();
    //         });
    //     });

    // }

    // updateMiniMap = () => {
    //     // const elementWidth = parseInt(this.element.clientWidth);
    //     // const elementHeight = parseInt(this.element.clientHeight);
    //     // const wrapperHeight = wrapperWidth * 9 / 16;

    //     const transform = this.panzoomInstance.getTransform();

    //     // // const percentWidth = wrapperWidth / (elementWidth * transform.scale) * 100;
    //     // // const percentHeight = percentWidth;

    //     const percentWidth = 100 - transform.scale * 100;
    //     const percentHeight = percentWidth;

    //     const wrapperWidth = parseInt(this.wrapper.clientWidth, 10);
    //     this.wrapper.setAttribute('style', 'height: ' + wrapperWidth * 9 / 16 + "px");

    //     const elementRect = Rectangle.From(this.element.getBoundingClientRect());
    //     const wrapperRect = Rectangle.From(this.wrapper.getBoundingClientRect());

    //     console.log('wrapper', this.wrapper.getBoundingClientRect());
    //     console.log('element', this.element.getBoundingClientRect())
    //     console.log('wrapperRect', wrapperRect);
    //     console.log('elementRect', wrapperRect);
    //     elementRect.translate(wrapperRect.point.clone().inverse());
    //     wrapperRect.resetPosition();
        
    //     const mapCenter = elementRect.getCenter();
    //     const mapBounds = elementRect.dimensions;
    //     const wrapperCenter = wrapperRect.getCenter();
    //     const wrapperDimensions = wrapperRect.dimensions;

    //     //TODO: calculate visible area in percent, based on screen positions 
    //     //      instead of more advanced calulations. 
    //     const viewport = Rectangle.FromCenter(wrapperCenter, wrapperDimensions);
    //     viewport.scaleToBounds(mapBounds);
    //     viewport.translate(mapCenter);

    //     console.log('viewport', viewport);
    //     console.log('elementRect', elementRect);
    //     console.log('wrapperRect', wrapperRect);

    //     const visibleTop = 50 - mapCenter.y / wrapperDimensions.height * 100;
    //     const visibleBottom = visibleTop + percentHeight;
    //     const visibleLeft = 50 - mapCenter.x / wrapperWidth * 100;
    //     const visibleRight = visibleLeft + percentWidth;

    //     const miniMapWidth = 200;
    //     const miniMapHeight = (wrapperDimensions.height / wrapperDimensions.width) * miniMapWidth;

    //     this.miniMapOverlay.setAttribute('style',
    //         'width: ' + miniMapWidth + 'px; ' +
    //         'height: ' + miniMapHeight + 'px;' +
    //         'clip-path: polygon(0 0, ' +
    //         '100% 0, ' +
    //         '100% 100%, ' +
    //         '0 100%, ' +
    //         '0 ' + visibleBottom + '%, ' +
    //         visibleRight + '% ' + visibleBottom + '%, ' +
    //         visibleRight + '% ' + visibleTop + '%, ' +
    //         visibleLeft + '% ' + visibleTop + '%, ' +
    //         visibleLeft + '% ' + visibleBottom + '%, ' +
    //         '0 ' + visibleBottom + '%);');
    //     this.miniMap.setAttribute('style',
    //         'background-image: url(' + this.minimapBackgroundImage + '); ' +
    //         'background-size: contain; ' +
    //         'background-repeat: no-repeat; ' +
    //         'background-position-y: 50%; ' +
    //         'width: ' + miniMapWidth + 'px; ' +
    //         'height: ' + miniMapHeight + 'px;');
    // }

    // disposeMiniMap = () => {
    //     if (!!this.panzoomInstance) {
    //         this.panzoomInstance.dispose();
    //         this.element.removeAttribute('style');
    //         this.wrapper.removeAttribute('style');
    //     }
    // }
}