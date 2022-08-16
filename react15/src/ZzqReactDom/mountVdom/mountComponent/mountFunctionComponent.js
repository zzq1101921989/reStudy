import mountVdom from "..";

/**
 * 函数组件处理方法
 * @param {*} vDom 
 * @param {*} container 
 */
export default function mountFunctionComponent (vDom, container) {
    const fn = vDom.type
    // 执行函数，得到需要渲染的virtualDom对象
    const elementVirtualDom = fn();
    if (elementVirtualDom) {
        mountVdom(elementVirtualDom, container)
    } else {
        throw new Error(fn.name + '没有返回需要渲染的元素，请好好检查一下')
    }
}