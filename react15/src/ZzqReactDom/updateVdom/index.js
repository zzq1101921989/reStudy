import createDomElement from "../mountVdom/createDomElement";
import mountComponent from "../mountVdom/mountComponent";
import updateNodeElementAttr from "../updateNodeElementAttr";
import {
  compareComponentProps,
  isComponent,
  isFunctionComponent,
  isSameComponent
} from "../utils";
import updateClassComponent from "./updateClassComponent";
import updateTextNodeElement from "./updateTextNodeElement";

/**
 * diff对比节点，更新元素属性，元素内容等
 * @param {*} newVdom 虚拟dom对象
 * @param {HTMLElement} container 挂载容器
 * @param {HTMLElement} oldDom 旧dom，用于后续的diff对比更新节点
 */
export default function updateVdom(newVdom, container, oldDom) {
  // 取出旧的virtualDom对比的时候需要用到
  const oldVirtualDom = oldDom._virtualDom;

  // 取出 oldVirtualDom 内部对应的实例对象
  const oldComponent = oldVirtualDom?.component;

  if (oldVirtualDom && newVdom) {
    /* 组件类型更新 */
    if (isComponent(newVdom)) {
      diffComponent(newVdom, oldComponent, oldVirtualDom, oldDom, container);
    } else if (newVdom.type === oldVirtualDom.type) {
      /* 证明类型是一样的，就不需要重新创建元素，更新元素即可 */
      if (
        newVdom.type === "text" &&
        newVdom.props.textContent !== oldVirtualDom.props.textContent
      ) {
        updateTextNodeElement(newVdom, oldDom);
      }
      // 加一个判断是否更新属性，因为文本没有属性的
      else {
        updateNodeElementAttr(oldDom, newVdom.props, oldVirtualDom.props);
      }

      diffChildren(newVdom, oldDom);

      /* 查看是否有子节点被删除 */
      updateDeleteChildren(oldDom, newVdom);
    } else if (
      /* 如果新旧节点类型都不一样了，那就没有对比的必要了，直接用replaceChiild替换就可以了 */
      newVdom &&
      newVdom.type !== oldVirtualDom.type &&
      typeof newVdom.type !== "function"
    ) {
      const newElement = createDomElement(newVdom);
      oldDom.parentNode.replaceChild(newElement, oldDom);
    }
  }
}

/**
 * 组件更新处理方法
 * 1、对于更新前后都是同一个组件的时候，需要对比内部的子组件是否相同
 * 2、对于更新前后完全不同一个组件的情况，直接用新组件内容去替代旧组件的内容即可
 * @param {*} newVirtualDom 新的virtualDom
 * @param {*} oldComponent 旧的组件实例对象，如果新旧实例组件都是同一个的话，那么就没必要重新new一个实例对象出来了，直接用旧的即可
 * @param {*} oldVirtualDom 就的virtualDom
 * @param {HTMLElement} oldDom 旧的真实dom对象
 * @param {HTMLElement} container 外层容器
 */
function diffComponent(
  newVirtualDom,
  oldComponent,
  oldVirtualDom,
  oldDom,
  container
) {
  /* 判断当前组件是否是同一个组件更新，如果是则进行对比，如果不是的话，那么直接替换就好了 */
  if (isSameComponent(newVirtualDom, oldComponent)) {
    if (isFunctionComponent(newVirtualDom)) {
      console.log("这里是更新函数组件");
    } else {
      if (!compareComponentProps(newVirtualDom.props, oldComponent.props)) {
        updateClassComponent(newVirtualDom, oldComponent, container, oldDom);
      }
    }
  } else {
    oldDom.remove();
    mountComponent(newVirtualDom, container);
  }
}

/**
 * 对比子节点，当有key和不存在key的时候对比的逻辑也是不一样的
 * @param {*} newVdom 新的虚拟dom节点
 * @param {HTMLElement} oldDom 旧的真实dom元素
 */
function diffChildren(newVdom, oldDom) {
  // 通过对象的方式记录一下，旧的元素的key对应的真实dom元素
  const keyElementMap = {};

  // 收集一下旧dom元素中带有key的元素
  for (let i = 0; i < oldDom.childNodes.length; i++) {
    let element = oldDom.childNodes[i];
    if (element.nodeType === 1) {
      let key = element.getAttribute("key");
      if (key && element) keyElementMap[key] = element;
    }
  }

  // 是否一个key都没有给
  const hasNokey = Object.keys(keyElementMap).length === 0;

  // 没有key，那就按照索引在进行对比了
  if (hasNokey) {
    newVdom.props.children.forEach((child, index) => {
      const childOldElement = oldDom.childNodes[index];
      updateVdom(child, childOldElement.parentNode, childOldElement);
    });
  }
  // 有的话，就按照key来试试
  else {
    newVdom.props.children.forEach((child, index) => {
      // 看一下新的virtualDom有没有元素
      const key = child.props.key;
      const domElement = keyElementMap[key];
      const childOldElement = oldDom.childNodes[index];
      if (key) {
        if (domElement) {
          if (childOldElement && childOldElement !== domElement) {
            oldDom.insertBefore(domElement, childOldElement);
          } else {
            updateVdom(child, childOldElement.parentNode, childOldElement);
          }
        } else {
          updateVdom(child, childOldElement.parentNode, childOldElement);
        }
      } else {
        updateVdom(child, childOldElement.parentNode, childOldElement);
      }
    });
  }
}

/**
 * 对比新旧节点，查看是否有需要被删除的节点
 * @param {HTMLElement} oldDom
 * @param {*} newVdom
 */
function updateDeleteChildren(oldDom, newVdom) {
  const oldChildren = oldDom.childNodes;
  const oldChildrenLen = oldChildren.length;
  const newChildren = newVdom.props.children;
  const newChildrenLen = newChildren.length;

  /* 证明在新节点中是存在被删除的元素的 */
  if (oldChildrenLen > newChildrenLen) {
    for (let i = oldChildrenLen - 1; i > newChildrenLen - 1; i--) {
      oldChildren[i].remove();
    }
  }
}
