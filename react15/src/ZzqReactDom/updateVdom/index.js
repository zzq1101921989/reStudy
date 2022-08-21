import diff from "../diff";
import updateNodeElementText from "./updateElementText";

/**
 * diff对比节点，更新元素属性，元素内容等
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 * @param {*} oldDom 旧dom，用于后续的diff对比更新节点
 */
export default function updateVdom (vDom, container, oldDom) {
    // 取出旧的virtualDom对比的时候需要用到
    const oldVirtualDom = oldDom._virtualDom;
    if (oldVirtualDom && vDom) {
        /* 证明类型是一样的，就不需要重新创建元素，更新元素即可 */
        if (vDom.type === oldVirtualDom.type) {
            if (vDom.type === 'text' && (vDom.props.textContent !== oldVirtualDom.props.textContent) ) {
                updateNodeElementText(vDom, oldDom)
            }
        }

        /* 子节点也是对比的 */
        oldVirtualDom.props.children.forEach((child, index) => {
            // 子元素对应的新的vDom
            const childNewVdom = vDom.props.children[index];
            // 子元素旧的dom元素
            const childOldElement = oldDom.childNodes[index];
            diff(childNewVdom, childOldElement.parentNode, childOldElement)
        })
    } 
}