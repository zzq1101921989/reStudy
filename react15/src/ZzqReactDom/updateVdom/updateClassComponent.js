import diff from "../diff";

/**
 * 更新类组件
 * @param {*} newVdom 
 * @param {*} oldVdom 
 * @param {HTMLElement} oldDom 
 */
export default function updateClassComponent(newVdom, oldVdom, oldDom) {

    const fn = newVdom.type

    const component = new fn(newVdom.props);

    // 执行函数，得到需要渲染的virtualDom对象
    const elementVirtualDom = component.render();

    // 把类组件实例绑定在虚拟对象上，方便后续收集真实的dom对象
    elementVirtualDom.component = component

    diff(elementVirtualDom, oldDom.parentNode, oldDom)

}