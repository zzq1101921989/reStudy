import mountVdom from "..";

/**
 * 类组件
 * @param {*} vDom 
 * @param {*} container 
 */
export default function mountClassComponent (vDom, container) {
    const fn = vDom.type
    const component = new fn(vDom.props);
    // 执行函数，得到需要渲染的virtualDom对象
    const elementVirtualDom = component.render();
    if (elementVirtualDom) {
        mountVdom(elementVirtualDom, container)
    } else {
        throw new Error(fn.name + '没有返回需要渲染的元素，请好好检查一下')
    }
}