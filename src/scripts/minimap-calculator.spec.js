import MinimapCalculator from './minimap-calculator';
import Rectangle from './geometry/rectangle';
import Point from './geometry/point';
import Dimensions from './geometry/dimensions';
import { exportAllDeclaration } from '@babel/types';

beforeEach(() => {
  //setup
});

afterEach(() => {
  //cleanup
});

// input => "element in container => viewport"
// *element => (x,y)[w,h]
// *container => (x,y)[w,h]
// *viewport => (left,top)(right,bottom)
const testViewport = (input) => {
  const regex = /\(((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\)\[((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\]\s*in\s*\(((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\)\[((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\]\s*=>\s*\(((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\)\(((?:-?)[\d\.]+)\s*,\s*((?:-?)[\d\.]+)\)/gm
  const match = regex.exec(input);

  if (match.length === 1)
    throw new Error("Can't parse input");

  const containerCenter = new Point(Number(match[5]), Number(match[6]));
  const containerDimensions = new Dimensions(Number(match[7]), Number(match[8]));
  const container = new Rectangle(containerCenter.translate(containerDimensions.width * -0.5, containerDimensions.height * -0.5), containerDimensions);

  const elementCenter = new Point(Number(match[1]), Number(match[2]));
  const elementDimensions = new Dimensions(Number(match[3]), Number(match[4]));
  const element = new Rectangle(elementCenter.translate(elementDimensions.width * -0.5, elementDimensions.height * -0.5), elementDimensions);

  var viewport = MinimapCalculator.getMinimapViewport(container, element);
  expect(viewport.toString()).toEqual(`(${Number(match[9])}, ${Number(match[10])})(${Number(match[11])}, ${Number(match[12])})`)
}

describe('Calculate minimap', () => {
  it('should be correct minimap viewport on different centered content', () => {
    testViewport('(5,5)[10,10] in (5,5)[10,10] => (0,0)(10,10)');
    testViewport('(5,5)[5,5] in (5,5)[10,10] => (-5,-5)(15,15)');
    testViewport('(5,5)[20,20] in (5,5)[10,10] => (2.5,2.5)(7.5,7.5)');
    testViewport('(5,5)[10,20] in (5,5)[10,10] => (2.5,2.5)(7.5,7.5)');
    testViewport('(5,5)[20,10] in (5,5)[10,10] => (2.5,2.5)(7.5,7.5)');
    testViewport('(5,5)[1,1] in (5,5)[10,10] => (-45,-45)(55,55)');
  });

  it('should be correct minimap viewport on different top-left content', () => {
    testViewport('(0,0)[10,10] in (5,5)[10,10] => (5,5)(15,15)');
    testViewport('(0,0)[5,5] in (5,5)[10,10] => (5,5)(25,25)');
    testViewport('(0,0)[20,20] in (5,5)[10,10] => (5,5)(10,10)');
    testViewport('(0,0)[10,20] in (5,5)[10,10] => (5,5)(10,10)');
    testViewport('(0,0)[20,10] in (5,5)[10,10] => (5,5)(10,10)');
    testViewport('(0,0)[1,1] in (5,5)[10,10] => (5,5)(105,105)');
  });

  it('should be correct minimap viewport on big zooms', () => {
    testViewport('(5,5)[1000,1000] in (5,5)[10,10] => (4.95,4.95)(5.05,5.05)');
    testViewport('(850,225)[1700,400] in (400,225)[800,450] => (0, 119.11764705882354)(376.4705882352941, 330.88235294117646))');
  });

  it('should be correct minimap viewport (0, 0) centered viewport', () => {
    testViewport('(0,0)[10,10] in (0,0)[10,10] => (-5,-5)(5,5)');
    testViewport('(0,0)[5,5] in (0,0)[10,10] => (-10,-10)(10,10)');
    testViewport('(5,5)[20,20] in (0,0)[10,10] => (-5,-5)(0,0)');
  });
});