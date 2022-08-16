/**
 * 判断当前的virtualDom是属于普通的元素节点，还是组件
 * @param {*} vDom 
 */
export function isComponent(vDom) {
    return vDom.type && typeof vDom.type === 'function';
}

/**
 * 判断当前的virtualDom是否是函数组件呢?
 * @param {*} vDom 
 */
export function isFunctionComponent(vDom) {
    const type = vDom.type
    return type && isComponent(vDom) && !(type.prototype && type.prototype.render)
}