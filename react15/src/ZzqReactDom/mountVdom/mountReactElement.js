import createDomElement from './createDomElement';

/**
 * 当前处理的只是普通的Vdom对象，直接根据type去创建元素即可
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 */
export default function mountReactElement (vDom, container) {
    let newElement = createDomElement(vDom)
    // 添加并且挂载节点
    container.appendChild(newElement)
}