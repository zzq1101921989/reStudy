import mountVdom from ".";
import updateNodeElementAttr from "../updateNodeElementAttr";

/**
 * 创建dom节点，并且添加属性
 * @param {*} vDom 虚拟Dom节点
 * @returns 
 */
export default function createDomElement (vDom) {
    let newElement = null;
    if (vDom.type === 'text') {
        newElement = document.createTextNode(vDom.props.textContent);
    } else {
        newElement = document.createElement(vDom.type);
        /* 节点的属性也要更新 */
        updateNodeElementAttr(newElement, vDom.props)
    }
    // 保存元素对应的vDom，后续更新比对的时候需要用到
    newElement._virtualDom = vDom
    // 如果还存在子节点的情况？
    const children = vDom.props.children
    if (children.length) {
        children.forEach(child => {
            mountVdom(child, newElement)
        })
    }
    return newElement;
}