import html2canvas from 'html2canvas';
import panzoom from 'panzoom';
import Rectangle from './geometry/rectangle';
import MinimapCalculator from './minimap-calculator';
import Point from './geometry/point';

export default class Tree {
    constructor() {
        this.wrapper = document.querySelector('.tree-wrapper');
        this.element = this.wrapper.querySelector('.tree');
        this.miniMap = this.wrapper.querySelector('figcaption');
        this.miniMapOverlay = this.miniMap.querySelector('code');

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
            this.disposeMiniMap();
        } else if (!this.desktop && window.innerWidth >= 768) {
            this.mobile = false;
            this.desktop = true;
            this.initiateMiniMap(this.element, this.wrapper, this.miniMap);
        }

        if (this.desktop && window.innerWidth >= 768) {
            if (!!this.panzoomInstance) {
                this.updateMiniMap();
            }
        }
    }

    handleOverlayClick = (e) => {
        e.stopPropagation();

        // TODO: verify these calculations
        const transform = this.panzoomInstance.getTransform();
        console.log('transform1', transform);

        const zoom1 = this.wrapper.clientWidth / this.element.clientWidth;
        const zoom2 = this.wrapper.clientHeight / this.element.clientHeight;

        const zoom = Math.min(zoom1, zoom2);

        var width_16_9 = this.element.clientWidth;
        var height_16_9 = this.element.clientHeight;

        if (zoom === zoom1) { //wide
            height_16_9 = this.wrapper.clientHeight / zoom;
        } else { //tall
            width_16_9 = this.wrapper.clientWidth / zoom;
        }

        console.log('width_16_9', width_16_9);
        console.log('height_16_9', height_16_9);

        const x = -(this.element.clientWidth + (width_16_9 - this.element.clientWidth) / 2) * e.offsetX / this.miniMap.clientWidth;
        const y = -(this.element.clientHeight + (height_16_9 - this.element.clientHeight) / 2) * e.offsetY / this.miniMap.clientHeight;

        console.log(`offset: (${e.offsetX}, ${e.offsetY})`);
        console.log(`this.element.clientWidth: ${this.element.clientWidth}`);
        console.log(`moveTo(${x}, ${y})`);
        console.log('transform2', transform);
        this.panzoomInstance.moveTo(x, y);
        this.updateMiniMap();
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

    initiateMiniMap = () => {
        const elementWidth = this.element.clientWidth;
        const elementHeight = this.element.clientHeight;
        const wrapperWidth = this.wrapper.clientWidth;
        const wrapperHeight = wrapperWidth * 9 / 16;

        const minMargin = 10;

        const zoom1 = (wrapperWidth - minMargin * 2) / elementWidth;
        const zoom2 = (wrapperHeight - minMargin * 2) / elementHeight;

        const zoom = Math.min(zoom1, zoom2);

        const x = (wrapperWidth - elementWidth * zoom) / 2;
        const y = (wrapperHeight - elementHeight * zoom) / 2;
        //this.wrapper.setAttribute('style', 'position: fixed; overflow: hidden;');
        //this.element.setAttribute('style', `transform: scale(${200 / (elementWidth + 400)});`);


        var style = document.createElement("style");
        style.appendChild(document.createTextNode(".person, .person *, *::before, *::after { color: transparent!important; background-color: #fff!important; border-color: #fff!important; outline-color: #fff!important; text-shadow: 0 0 0 #fff!important; outline-width: 10px!important; box-shadow: 0 0 6px 4px #fff;"));
        document.head.appendChild(style);

        html2canvas(this.element, {
            backgroundColor: "rgba(0,0,0,0)",
            imageTimeout: 0,
            windowWidth: 1920,
            windowHeight: 1200
        }).then((canvas) => {
            this.wrapper.removeAttribute('style');
            this.element.removeAttribute('style');
            // this.canvas = c;

            //todo: scale down to width: 200px, since the background-image is allways presented as width: 200px;
            //      https://html2canvas.hertzen.com/configuration/
            //      https://stackoverflow.com/a/27847681/2913268
            this.minimapBackgroundImage = canvas.toDataURL("image/png");
            document.head.removeChild(style);

            this.panzoomInstance = panzoom(this.element, {
                maxZoom: 1,
                minZoom: 0.1
            });

            this.panzoomInstance.zoomAbs(
                x, // initial x position
                y, // initial y position
                zoom  // initial zoom 
            );

            this.updateMiniMap();

            this.panzoomInstance.on('panstart', (e) => { });
            this.panzoomInstance.on('pan', (e) => { });
            this.panzoomInstance.on('panend', (e) => { });
            this.panzoomInstance.on('zoom', (e) => { });

            this.panzoomInstance.on('transform', (e) => {
                this.updateMiniMap();
            });
        });

    }

    updateMiniMap = () => {
        const wrapperWidth = parseInt(this.wrapper.clientWidth, 10);
        this.wrapper.setAttribute('style', 'height: ' + wrapperWidth * 9 / 16 + "px");

        var wrapperRect = Rectangle.From(this.wrapper.getBoundingClientRect());
        var wrapperRectClone = wrapperRect.clone();
        const elementRect = Rectangle.From(this.element.getBoundingClientRect()).clone().translate(new Point(-wrapperRect.x, -wrapperRect.y));
        wrapperRectClone = wrapperRectClone.resetPosition();

        const viewport = MinimapCalculator.getMinimapViewport(wrapperRectClone, elementRect);

        const miniMapWidth = 200;
        const miniMapHeight = (wrapperRect.dimensions.height / wrapperRect.dimensions.width) * miniMapWidth;

        const minimap = MinimapCalculator.getMinimapViewportPercentages(wrapperRect, viewport);

        this.miniMapOverlay.setAttribute('style',
            'width: ' + miniMapWidth + 'px; ' +
            'height: ' + miniMapHeight + 'px;' +
            'clip-path: polygon(0 0, ' +
            '100% 0, ' +
            '100% 100%, ' +
            '0 100%, ' +
            '0 ' + minimap.bottom + '%, ' +
            minimap.right + '% ' + minimap.bottom + '%, ' +
            minimap.right + '% ' + minimap.top + '%, ' +
            minimap.left + '% ' + minimap.top + '%, ' +
            minimap.left + '% ' + minimap.bottom + '%, ' +
            '0 ' + minimap.bottom + '%);');
        this.miniMap.setAttribute('style',
            'background-image: url(' + this.minimapBackgroundImage + '); ' +
            'background-size: contain; ' +
            'background-repeat: no-repeat; ' +
            'background-position-y: 50%; ' +
            'width: ' + miniMapWidth + 'px; ' +
            'height: ' + miniMapHeight + 'px;');
    }

    disposeMiniMap = () => {
        if (!!this.panzoomInstance) {
            this.panzoomInstance.dispose();
            this.element.removeAttribute('style');
            this.wrapper.removeAttribute('style');
        }
    }
}