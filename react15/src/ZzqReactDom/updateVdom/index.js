import diff from "../diff";
import createDomElement from "../mountVdom/createDomElement";
import updateNodeElementAttr from "../updateNodeElementAttr";
import { compareComponentProps, isComponent, isFunctionComponent } from "../utils";
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

  if (oldVirtualDom && newVdom) {

    /* 组件类型更新 */
    if (isComponent(newVdom)) {
      updateReactCompoent(newVdom, oldVirtualDom, oldDom)
    }  
    /* 证明类型是一样的，就不需要重新创建元素，更新元素即可 */
    else if (newVdom.type === oldVirtualDom.type) {
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
      /* 子节点也是对比的 */
      newVdom.props.children.forEach((child, index) => {
        // 子元素旧的dom元素
        const childOldElement = oldDom.childNodes[index];
        diff(child, childOldElement.parentNode, childOldElement);
      });
      /* 查看是否有子节点被删除 */
      updateDeleteChildren(oldDom, newVdom)
    }
    /* 如果新旧节点类型都不一样了，那就没有对比的必要了，直接用replaceChiild替换就可以了 */
    else if (
      newVdom && newVdom.type !== oldVirtualDom.type && typeof newVdom.type !== "function"
    ) {
      const newElement = createDomElement(newVdom);
      oldDom.parentNode.replaceChild(newElement, oldDom);
    }
  }
}

/**
 * 组件更新处理方法，对于函数组件和类组件，采用不同的更新方法
 * @param {*} newVirtualDom 
 * @param {*} oldVirtualDom 
 * @param {*} oldDom 
 */
function updateReactCompoent(newVirtualDom, oldVirtualDom, oldDom) {
  if (isFunctionComponent(newVirtualDom)) {
    console.log('这里是更新函数组件');
  } else {
    if (!compareComponentProps(newVirtualDom.props, oldVirtualDom.component.props)) {
      updateClassComponent(newVirtualDom, oldVirtualDom, oldDom)
    }
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
