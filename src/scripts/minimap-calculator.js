import Viewport from './geometry/viewport';
import Point from './geometry/point';

export default class MinimapCalculator {
    static getMinimapViewport(containerRect, elementRect) {
        const containerViewport = Viewport.From(containerRect);
        const elementViewport = Viewport.From(elementRect);

        const scale1 = containerRect.dimensions.width / elementRect.dimensions.width;
        const scale2 = containerRect.dimensions.width / elementRect.dimensions.height;
        const scale = Math.min(scale1, scale2);
        
        const elementCenter = elementViewport.getCenter();
        const containerCenter = containerViewport.getCenter();
        const relativeCenter = new Point(containerCenter.x * scale - elementCenter.x * scale, containerCenter.y * scale - elementCenter.y * scale);
        const minimapCenter = new Point(containerCenter.x + relativeCenter.x, containerCenter.y + relativeCenter.y);

        return new Viewport(minimapCenter, containerViewport.getDimensions().scale(scale));
    }

    static getMinimapViewportPercentages(containerRect, viewport) {
        return {
            top: viewport.top / containerRect.dimensions.height * 100,
            right: viewport.right / containerRect.dimensions.width * 100,
            bottom: viewport.bottom / containerRect.dimensions.height * 100,
            left: viewport.left / containerRect.dimensions.width * 100
        };
    }
}