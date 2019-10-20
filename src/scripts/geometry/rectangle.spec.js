import Rectangle from './rectangle';
import Point from './point';
import Dimensions from './dimensions';

beforeEach(() => {
  //setup
});

afterEach(() => {
  //cleanup
});

test('simple rectangle test', () => {
  const rect1 = new Rectangle(new Point(0, 0), new Dimensions(10, 10));
  expect(rect1.point.x).toBe(0);
  expect(rect1.point.y).toBe(0);
  expect(rect1.dimensions.width).toBe(10);
  expect(rect1.dimensions.height).toBe(10);
});