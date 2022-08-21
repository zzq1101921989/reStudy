/**
 * 把最新的text文本节点上的内容直接更新了即可，并且对应的virtualDom也要同步更新
 * @param {*} vDom 最新的虚拟dom对象
 * @param {*} oldDom 旧的HTML元素
 */
export default function updateNodeElementText (vDom, oldDom) {
    oldDom.textContent = vDom.props.textContent
    oldDom._virtualDom = vDom
    return oldDom
}