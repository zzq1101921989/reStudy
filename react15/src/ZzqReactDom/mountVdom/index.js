import { isComponent } from "../utils";
import mountComponent from "./mountComponent";
import mountReactElement from "./mountReactElement";

/**
 * 根据vdom传递过来的数据判断当前是组件还是普通的Vdom对象，处理的方式也不同
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 */
export default function mountVdom(vDom, container) {
  // Component
  if (isComponent(vDom)) {
    mountComponent(vDom, container)
  }
  // ReactElement
  else {
    mountReactElement(vDom, container);
  }
}
