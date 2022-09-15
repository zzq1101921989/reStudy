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
  // 这里就只处理一种情况，就是元素是否只是调换了位置
  else {
    newVdom.props.children.forEach((child, index) => {

      // 从最新的virtualDom取出key属性（如果存在的情况下）
      const key = child.props.key;

      // 尝试通过这个key，看看是否可以在旧dom中对象中发现，如果能发现，可以保证的是节点并没有删除
      const domElement = keyElementMap[key];

      // 即使存在，但是也不能保持位置没有调换，所以还需要根据新vDom的索引去取旧dom元素的子元素。从而对比是否相等，不相等证明位置改变过
      const childOldElement = oldDom.childNodes[index];

      if (key && domElement) {
        // 位置改变过
        if (childOldElement && childOldElement !== domElement) {
          oldDom.insertBefore(domElement, childOldElement);
        }
      } else if (!key && newVdom.props.children.length === oldDom.childNodes.length) {
        updateVdom(child, childOldElement.parentNode, childOldElement);
      }
    });
  }

  /* 查看是否有子节点被删除 */
  updateDeleteChildren(hasNokey, oldDom, newVdom);
}

/**
 * 删除节点的同时，还需要当前的节点是不是文本节点，如果是，则可以直接删除
 * 如果不是还需要查看是否是组件类型，如果是组件类型的话，需要调用组件的卸载生命周期，并且取消事件的注册，ref属性清空
 * @param {HTMLElement} node 真实的dom节点
 */
function unmountNode(node) {

  const oldVirtualDom = node._virtualDom;

  /* 1、如果是文本节点那么就直接删除就好了，不需要考虑其他的东西 */
  if (oldVirtualDom.type === "text") {
    node.remove();
    return;
  }

  const component = oldVirtualDom.component;

  /* 2、如果有实例化的类组件绑定着？那么就证明是类组件生成的dom元素，就需要调用卸载生命周期的方法 */
  if (component) {
    if (component.componentWillUnmount) component.componentWillUnmount();
  }

  if (oldVirtualDom.props) {
    /* 3、如果组件上绑定了ref属性，那么也需要一并清空了 */
    if (oldVirtualDom.props.ref) oldVirtualDom.props.ref(null);

    /* 4、如果绑定了事件，那么也不要忘记进行清理 */
    Object.keys(oldVirtualDom.props).forEach((item) => {
      if (item.slice(0, 2) === "on") {
        const evnetName = item.toLocaleLowerCase().slice(2);
        const eventHandler = oldVirtualDom.props[item];
        node.removeEventListener(evnetName, eventHandler);
      }
    });
  }

  /* 5、如果还存在子节点？那么也需要重复这些操作 */
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i]);
      i--;
    }
  }

  /* 6、最后一步就是删除元素了 */
  node.remove();
}

/**
 * 对比新旧节点，查看是否有需要被删除的节点
 * @param {boolean} hasNokey 是否采用key的方式进行对比
 * @param {HTMLElement} oldDomContainer
 * @param {*} newVdom
 */
function updateDeleteChildren(hasNokey, oldDomContainer, newVdom) {
  const oldChildren = oldDomContainer.childNodes;
  const newChildren = newVdom.props.children;
  const newChildrenLen = newChildren.length;

  if (hasNokey) {
    /* 证明在新节点中是存在被删除的元素的 */
    if (oldChildren.length > newChildrenLen) {
      console.log(oldChildren, 'oldChildren');
      for (let i = oldChildren.length - 1; i > newChildrenLen - 1; i--) {
        unmountNode(oldChildren[i]);
      }
    }
  } else {
    /* 从旧的dom中拿出key */
    for (let i = 0; i < oldChildren.length; i++) {
      const oldDom = oldChildren[i];
      const oldKey = oldDom._virtualDom.props.key;
      let found = false;
      for (let y = 0; y < newChildrenLen; y++) {
        const newDom = newChildren[y];
        const newKey = newDom.props.key;
        if (
          (oldKey && oldKey === newKey) ||
          (!oldKey && oldDom._virtualDom.type === newChildren[y].type)
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        unmountNode(oldDom);
        i--;
      }
    }
  }
}
