import createDomElement from './createDomElement';

/**
 * 当前处理的只是普通的Vdom对象，直接根据type去创建元素即可
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 */
export default function mountReactElement (vDom, container) {
    
    let newElement = createDomElement(vDom)

    // 这种情况就代表这个虚拟dom的产生实际上就是通过 类组件 的render得来的，因为在 mountClassComponent 方法中注入了这个属性
    if (vDom.component) {
        vDom.component.setDom(newElement)
    }

    // 添加并且挂载节点
    container.appendChild(newElement)

    if (vDom.props && vDom.props.ref) vDom.props.ref(newElement);

}