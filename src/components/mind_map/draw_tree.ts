// @ts-nocheck
import { NODE_SPACE, NODE_SPACE_X, renderTree } from './render';
import { calcSize, deepCopy } from './utils';

class DrawTree {
  constructor(tree, parent = null, depth = 0, number = 1) {
    this.name = tree.name;
    this.width = tree.width || 30;
    this.height = tree.height || 20;
    this.y = -1;
    this.x = depth;
    this.children = tree?.children?.map((child, index) => {
      return new DrawTree(child, this, depth + 1, index + 1);
    });
    this.parent = parent;
    // 线程节点，也就是指向下一个轮廓节点
    this.thread = null;
    // 根据左兄弟定位的x与根据子节点中间定位的x之差
    this.mod = 0;
    // 要么指向自身，要么指向所属树的根
    this.ancestor = this;
    this.change = this.shift = 0;
    // 最左侧的兄弟节点
    this._lmost_sibling = null;
    // 这是它在兄弟节点中的位置索引 1...n
    this.number = number;
    // 该节点子节点的最大宽度
    // this.maxChildrenWidth = 0
    this.minY = 0;
    this.maxY = 0;
    this.offset = 0;
  }

  // 有线程返回线程节点，否则返回最右侧的子节点，也就是树的右轮廓
  right() {
    return (
      this.thread ||
      (this.children.length > 0
        ? this.children[this.children.length - 1]
        : null)
    );
  }

  // 有线程返回线程节点，否则返回最左侧的子节点，也就是树的左轮廓
  left() {
    return this.thread || (this.children.length > 0 ? this.children[0] : null);
  }

  // 获取前一个兄弟节点
  left_brother() {
    let n = null;
    if (this.parent) {
      for (let i = 0; i < this.parent.children.length; i++) {
        let node = this.parent.children[i];
        if (node === this) {
          return n;
        } else {
          n = node;
        }
      }
    }
    return n;
  }

  // 获取同一层级第一个兄弟节点，如果第一个是自身，那么返回null
  get_lmost_sibling() {
    if (
      !this._lmost_sibling &&
      this.parent &&
      this !== this.parent.children[0]
    ) {
      this._lmost_sibling = this.parent.children[0];
    }
    return this._lmost_sibling;
  }

  // 同一层级第一个兄弟节点
  get leftmost_sibling() {
    return this.get_lmost_sibling();
  }
}

// 第一次递归
const firstWalk = (v) => {
  if (v.children.length === 0) {
    // 当前节点是叶子节点且存在左兄弟节点，则其x坐标等于其左兄弟的x坐标加上间距distance
    if (v.leftmost_sibling) {
      v.y = v.left_brother().y + NODE_SPACE;
    } else {
      // 当前节点是叶节点无左兄弟，那么x坐标为0
      v.y = 50;
    }
  } else {
    // default_ancestor初始指向第一个子节点
    let default_ancestor = v.children[0];
    // let maxChildrenWidth = 0
    v.children.forEach((child) => {
      firstWalk(child);
      // 找出子节点的最大宽度
      // if (child.width > maxChildrenWidth) {
      //     maxChildrenWidth = child.width
      // }
      default_ancestor = apportion(child, default_ancestor);
    });
    // v.maxChildrenWidth = maxChildrenWidth
    // 将shift分摊添加到中间的节点上，也就是添加到节点的x及mod值上
    execute_shifts(v);

    // 子节点的中点
    let midpoint = (v.children[0].y + v.children[v.children.length - 1].y) / 2;
    let w = v.left_brother();
    if (w) {
      // 如果是非叶子节点则其x坐标等于其左兄弟的x坐标加上间距distance
      v.y = w.y + NODE_SPACE;
      // 同时记录下偏移量（x坐标与子节点的中点之差）
      v.mod = v.y - midpoint;
    } else {
      // 没有左兄弟节点，x坐标直接是子节点的中点
      v.y = midpoint;
    }
  }
  return v;
};

// 修正子孙节点定位
const apportion = (v, default_ancestor) => {
  let leftBrother = v.left_brother();
  if (leftBrother) {
    // 四个节点指针
    let vInnerRight = v; // 右子树左轮廓
    let vOuterRight = v; // 右子树右轮廓
    let vInnerLeft = leftBrother; // 当前节点的左兄弟节点，左子树右轮廓
    let vOuterLeft = v.leftmost_sibling; // 当前节点的最左侧的兄弟节点，左子树左轮廓

    // 累加mod值，它们的父节点是同一个，所以往上它们要加的mod值也是一样的，那么在后面shift值计算时vInnerLeft.y + 父节点.mod - (vInnerRight.y + 父节点.mod)，父节点.mod可以直接消掉，所以不加上面的祖先节点的mod也没关系
    let sInnerRight = vInnerRight.mod;
    let sOuterRight = vOuterRight.mod;
    let sInnerLeft = vInnerLeft.mod;
    let sOuterLeft = vOuterLeft.mod;

    // 一直遍历到叶子节点
    while (vInnerLeft.right() && vInnerRight.left()) {
      // 更新指针
      vInnerLeft = vInnerLeft.right();
      vInnerRight = vInnerRight.left();
      vOuterLeft = vOuterLeft.left();
      vOuterRight = vOuterRight.right();

      // 节点v下面的每一层右轮廓节点都关联v
      vOuterRight.ancestor = v;

      // 左侧节点减右侧节点
      let shift =
        vInnerLeft.y + sInnerLeft + NODE_SPACE - (vInnerRight.y + sInnerRight);
      if (shift > 0) {
        let _ancestor = ancestor(vInnerLeft, v, default_ancestor);
        // 大于0说明存在交叉，那么右侧的树要向右移动
        move_subtree(_ancestor, v, shift);
        // v.mod，也就是右侧子树增加了shift，sInnerRight、sOuterRight当然也要同步增加
        sInnerRight += shift;
        sOuterRight += shift;
      }

      // 累加当前层节点mod
      sInnerRight += vInnerRight.mod;
      sOuterRight += vOuterRight.mod;
      sInnerLeft += vInnerLeft.mod;
      sOuterLeft += vOuterLeft.mod;
    }

    // 将线程从浅的树的外侧设置到深的树的内侧
    if (vInnerLeft.right() && !vOuterRight.right()) {
      vOuterRight.thread = vInnerLeft.right();
      // 修正因为线程影响导致mod累加出错的问题，深的树减浅树
      vOuterRight.mod += sInnerLeft - sOuterRight;
    } else {
      if (vInnerRight.left() && !vOuterLeft.left()) {
        vOuterLeft.thread = vInnerRight.left();
        vOuterLeft.mod += sInnerRight - sOuterLeft;
      }
      default_ancestor = v;
    }
  }
  return default_ancestor;
};

// 移动子树
const move_subtree = (leftV, v, shift) => {
  let subTrees = v.number - leftV.number; // 索引相减，得到之间被分隔的数量
  let average = shift / subTrees; // 平分偏移量
  v.shift += shift; // 完整的shift值添加到v节点的shift属性上
  v.change -= average;
  leftV.change += average;

  v.y += shift; // 自身移动
  v.mod += shift; // 后代节点移动
};

// 应用分摊
const execute_shifts = (v) => {
  let change = 0;
  let shift = 0;
  // 从后往前遍历子节点
  for (let i = v.children.length - 1; i >= 0; i--) {
    let node = v.children[i];
    node.y += shift;
    node.mod += shift;

    change += node.change;
    shift += node.shift + change;
  }
};

// 找出节点所属的根节点
const ancestor = (vInnerLeft, v, default_ancestor) => {
  // 如果vInnerLeft节点的ancestor指向的节点是v节点的兄弟，那么符合要求
  if (v.parent.children.includes(vInnerLeft.ancestor)) {
    return vInnerLeft.ancestor;
  } else {
    // 否则使用default_ancestor指向的节点
    return default_ancestor;
  }
};

// 第二次遍历
const second_walk = (v, m = 0, depth = 0, s = 0) => {
  // 初始x值加上所有祖宗节点的mod修正值
  v.y += m;
  v.x = depth * NODE_SPACE_X + s + NODE_SPACE_X;
  v.children.forEach((child) => {
    // let maxWidth = 0
    // if (v.parent) {
    //     maxWidth = v.parent.maxChildrenWidth
    // } else {
    //     maxWidth = v.width
    // }
    second_walk(child, m + v.mod, depth + 1, s + v.width);
  });
};

// 第三次遍历
const third_walk = (tree) => {
  let selfMinY = tree.y - tree.height / 2;
  let selfMaxY = tree.y + tree.height / 2;
  // 计算每个节点的minY和maxY
  if (tree.children.length > 0) {
    let minY = Infinity;
    let maxY = -Infinity;
    tree.children.forEach((child) => {
      third_walk(child);
      if (child.minY < minY) {
        minY = child.minY;
      }
      if (child.maxY > maxY) {
        maxY = child.maxY;
      }
    });

    tree.minY = selfMinY < minY ? selfMinY : minY;
    tree.maxY = selfMaxY > maxY ? selfMaxY : maxY;
  } else {
    tree.minY = selfMinY;
    tree.maxY = selfMaxY;
  }
  // 判断是否和左兄弟有交叉
  if (tree.left_brother()) {
    if (tree.minY < tree.left_brother().maxY + NODE_SPACE) {
      let o = tree.left_brother().maxY - tree.minY + NODE_SPACE;
      tree.offset = o; // 用于移动子节点
      tree.y += o; // 移动自身
      tree.minY += o; // 更新minY、maxY
      tree.maxY += o;
    }
  }
};

// 第四次遍历
const fourth_walk = (tree, o = 0) => {
  tree.y += o;
  tree.children.forEach((child) => {
    fourth_walk(child, o + tree.offset);
  });
  let len = tree.children.length;
  if (len <= 0) {
    return;
  }
  // 重新居于子节点中间
  let mid = (tree.children[0].y + tree.children[len - 1].y) / 2;
  tree.y = mid;
};

const buchheim = (tree) => {
  let dt = firstWalk(tree);
  second_walk(dt);
  third_walk(dt);
  fourth_walk(dt);
  return dt;
};

export function drawTree(treeData) {
  let tree = new DrawTree(calcSize(deepCopy(treeData)));
  tree = buchheim(tree);
  console.log(
    '%c tree',
    'color:white;background: rgb(83,143,204);padding:4px',
    tree
  );
  renderTree(tree, 'mind');
}
