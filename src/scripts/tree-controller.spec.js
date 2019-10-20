import TreeController from './tree-controller';
import TestTreeRenderer from './test-tree-renderer';
import TestMiniMapRenderer from './test-mini-map-renderer';

var controller = null;
var treeRenderer = null;
var miniMapRenderer = null;
beforeEach(() => {
  //setup
  treeRenderer = new TestTreeRenderer();
  miniMapRenderer = new TestMiniMapRenderer();
  controller = new TreeController(treeRenderer, miniMapRenderer);
});

afterEach(() => {
  //cleanup
});

describe('Test controller initialization', () => {
  test('initializes correctly', () => {
    expect(treeRenderer.actions).toEqual([]);
    expect(miniMapRenderer.actions).toEqual([]);
  });
});

describe('Test controller MiniMap', () => {
  it('should create preview screenshot image', () => {
    document.documentElement.innerHTML = '<html><head><meta charset="UTF-8"><title>title</title></head><body></body></html>';

    const treeElement = document.createElement("div");
    treeElement.style.width = "1000px";
    treeElement.style.height = "100px";

    const pElement = document.createElement("p");
    pElement.innerHTML = "Dummy text";
    treeElement.append(pElement);

    document.body.append(treeElement);

    const containerElement = document.createElement("div");
    containerElement.style.width = `${800}px`;
    containerElement.style.height = `${800 / 16 * 9}px`;
    document.body.append(containerElement);

    return controller.generateMiniMapBackgroundImage(treeElement, containerElement)
      .then(() => {
        expect(miniMapRenderer.actions).toEqual(["set-mini-map-background-image"]);
      }).catch((error) => {
        throw error;
      });
  });

  it('should be a correct viewport on minimap in zoom 1.0', () => {
    throw new Error("test not implemented yet!");
  });

  test('should be a correct viewport on minimap in zoom 0.5', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap initial viewport is correct in zoom 0.1', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap panned viewport is correct in zoom 1.0', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap panned viewport is correct in zoom 0.5', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap panned viewport is correct in zoom 0.1', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap click shows correct wrapper viewport in zoom 1.0', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap click shows correct wrapper viewport in zoom 0.5', () => {
    throw new Error("test not implemented yet!");
  });

  test('minimap click shows correct wrapper viewport in zoom 0.1', () => {
    throw new Error("test not implemented yet!");
  });
});

describe('Test controller tree', () => {
  test('zooms to fit rendered area', () => {
    throw new Error("test not implemented yet!");
  });
});