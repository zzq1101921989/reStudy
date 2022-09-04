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

/**
 * 比较新旧组件的props是否不一致，如果不一致，那么就需要更新组件，重新渲染了
 * @return {boolean} true代表没变化，false代表需要更新
 */
export function compareComponentProps(newProps, oldProps) {
    // 定义一个变量，用来计数变化的次数
    let flag = 0;
    Object.keys(newProps).forEach(key => {
        if (newProps[key] !== oldProps[key]) {
            flag++
        }
    })
    return flag === 0
}

/**
 * 查看是否是同一个组件对象，根据新virtual对象的type属性和旧类组件的constructor进行对比即可（目前该函数的功能之实现了类组件的判断）
 * 
 */
export function isSameComponent(newVirtualDom, oldComponent) {
    return newVirtualDom.type === oldComponent.constructor
}