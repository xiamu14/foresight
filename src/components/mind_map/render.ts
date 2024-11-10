import Konva from 'konva';
import { Layer } from 'konva/lib/Layer';

export const NODE_SPACE = 20;
export const NODE_SPACE_X = 50;

const textColor = '#595959';

let layer: Layer | null = null;
// 初始化舞台
export const init = (drawBox: string | HTMLDivElement) => {
  let stage = new Konva.Stage({
    container: drawBox,
    width: 600,
    height: 800,
    draggable: true,
  });
  layer = new Konva.Layer();
  stage.add(layer);
};

// 绘制节点
export const drawNode = (x: number, y: number, name: string, w: number, h: number) => {
  let width = w || 30;
  let height = h || 20;
  let rect = new Konva.Rect({
    x: x - 5,
    y: y - height / 2,
    width: width + 20,
    height: height + 10,
    cornerRadius: 10,
    fill: '#fff',
    stroke: '#2f54eb',
    strokeWidth: 1,
  });
  layer?.add(rect);

  let text = new Konva.Text({
    x: x,
    y: y + 5,
    text: name,
    fontSize: 14,
    lineHeight: 1.5,
    width: width + 10,
    padding: 5,
    fill: textColor,
    align: 'center',
  });
  text.on('click', () => {
    const element = document.getElementById(name.toLowerCase());
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
    // window.location.href = window.location.href + '#' + name.toLowerCase();
  });
  text.offsetX(-(width - text.width()) / 2);
  text.offsetY(text.height() / 2);
  layer?.add(text);

  layer?.draw();
};
// 绘制连接线
export const drawLine = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  let line = new Konva.Line({
    points: [a.x, a.y, b.x, b.y],
    stroke: 'black',
    strokeWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
  });
  layer?.add(line);
  layer?.draw();
};
// 绘制思维导图连接线
export const drawMindLine = (
  a: { x: number; y: number; width: number },
  b: { x: number; y: number }
) => {
  let line = new Konva.Line({
    points: [
      a.x + a.width,
      a.y,
      b.x - NODE_SPACE_X / 2,
      a.y,
      b.x - NODE_SPACE_X / 2,
      b.y,
      b.x,
      b.y,
    ],
    bezier: true,
    stroke: '#bfbfbf',
    strokeWidth: 1,
    lineCap: 'round',
    lineJoin: 'round',
  });
  layer?.add(line);
  layer?.draw();
};

// 绘制多叉树
export const renderTree = (tree: any) => {
  tree?.children.forEach((child: any) => {
    drawMindLine(tree, child);

    renderTree(child);
  });
  drawNode(tree.x, tree.y, tree.name, tree.width, tree.height);
};
// 处理树数据
export const handleTree = (tree: any) => {
  tree.x *= NODE_SPACE_X;
  tree.x += NODE_SPACE_X;

  tree.y *= NODE_SPACE_X;
  tree.y += NODE_SPACE_X;

  tree.children.forEach((child: any) => {
    handleTree(child);
  });
};
// 清除画布
export const clear = () => {
  layer?.removeChildren();
};
