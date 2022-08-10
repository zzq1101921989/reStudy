import mountVdom from './index';

/**
 * 当前处理的只是普通的Vdom对象，直接根据type去创建元素即可
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 */
export default function mountReactElement (vDom, container) {
    let newElement = null;
    if (vDom.type === 'text') {
        newElement = document.createTextNode(vDom.props.textContent);
    } else {
        newElement = document.createElement(vDom.type);
    }
    // 如果还存在子节点的情况？
    const children = vDom.props.children
    if (children.length) {
        children.forEach(child => {
            mountVdom(child, newElement)
        })
    }

    // 添加并且挂载节点
    container.appendChild(newElement)
}