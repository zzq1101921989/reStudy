/**
 * 更新节点的属性，比如className、实践、style、type、value、data-xxx等
 * @param {HTMLElement} element 需要绑定属性的html元素
 * @param {*} newProps 新的属性对象，key代表属性名称，value代表属性的值
 * @param {*} oldProps 旧的属性对象，用于和新的props作对比，从而找出差异的部分
 */
export default function updateNodeElementAttr(
  element,
  newProps,
  oldProps={}
) {
  
  // 正常的进行遍历
  Object.keys(newProps).forEach((propName) => {
    const newPropValue = newProps[propName];
    const oldPropValue = oldProps[propName];
    if (newPropValue !== oldPropValue) {
      // 绑定事件
      if (isBindEvent(propName)) {
        const eventName = propName.toLowerCase().slice(2);
        element.addEventListener(eventName, newPropValue);
        if (oldPropValue) {
          element.removeEventListener(eventName, oldPropValue);
        }
      }
      // 绑定表单的属性
      else if (isBindInputHtmlAttr(propName)) {
        element[propName] = newPropValue;
      }
      // 是否绑定类名
      else if (isBindClassName(propName)) {
        element.setAttribute("class", newPropValue);
      }
      // 行内样式表
      else if (isBindStyle(propName)) {
        handlerCssStyle(element, newPropValue);
      } else if (propName !== "children" && propName !== "ref") {
        element.setAttribute(propName, newPropValue);
      }
    }
  });

  // 既然有了oldProps，那就证明是更新的时候了，看看有没有需要删除的属性
  Object.keys(oldProps).forEach((propName) => {
    const newPropValue = newProps[propName];
    const oldPropValue = oldProps[propName];
    if (!newPropValue) {
      if (isBindEvent(propName)) {
        element.removeEventListener(propName, oldPropValue);
      } else {
        element.removeAttribute(propName);
      }
    }
  });
}

/**
 * 当前的属性是否是事件属性
 * @param {*} key 属性名称
 * @return {boolean}
 */
function isBindEvent(key) {
  return key.slice(0, 2) === "on";
}

/**
 * 当前的属性是否是表单相关的
 * @param {*} key 属性名称
 * @return {boolean}
 */
function isBindInputHtmlAttr(key) {
  return ["value", "checked"].includes(key);
}

/**
 * 当前的属性是否是类名
 * @param {*} key 属性名称
 * @return {boolean}
 */
function isBindClassName(key) {
  return key === "className";
}

/**
 * 当前的属性是否是行内样式
 * @param {*} key 属性名称
 * @return {boolean}
 */
function isBindStyle(key) {
  return key === "style";
}

/**
 * 处理style样式
 * @param {HTMLElement} element
 * @param {Object} styleValue
 * @return {string} 返回的是 width: 100px;height: 100px 类似这种css文本
 */
function handlerCssStyle(element, styleValue) {
  if (styleValue instanceof Object) {
    Object.keys(styleValue).map((propName) => {
      const value = styleValue[propName];
      element.style[propName] = value;
    });
  } else {
    throw new Error("暂时只支持传入对象类型的style属性");
  }
}
