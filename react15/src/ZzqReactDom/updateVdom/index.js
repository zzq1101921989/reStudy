import diff from "../diff";
import updateNodeElementAttr from "../updateNodeElementAttr";
import updateTextNodeElement from "./updateTextNodeElement";

/**
 * diff对比节点，更新元素属性，元素内容等
 * @param {*} newVdom 虚拟dom对象
 * @param {*} container 挂载容器
 * @param {*} oldDom 旧dom，用于后续的diff对比更新节点
 */
export default function updateVdom (newVdom, container, oldDom) {
    // 取出旧的virtualDom对比的时候需要用到
    const oldVirtualDom = oldDom._virtualDom;
    if (oldVirtualDom && newVdom) {
        /* 证明类型是一样的，就不需要重新创建元素，更新元素即可 */
        if (newVdom.type === oldVirtualDom.type) {
            if (newVdom.type === 'text' && (newVdom.props.textContent !== oldVirtualDom.props.textContent) ) {
                updateTextNodeElement(newVdom, oldDom)
            }
            // 加一个判断是否更新属性，因为文本没有属性的 
            else {
                updateNodeElementAttr(oldDom, newVdom.props, oldVirtualDom.props)
            }
        }

        /* 子节点也是对比的 */
        newVdom.props.children.forEach((child, index) => {
            // 子元素旧的dom元素
            const childOldElement = oldDom.childNodes[index];
            diff(child, childOldElement.parentNode, childOldElement)
        })
    } 
}