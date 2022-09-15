import mountVdom from "..";

/**
 * 类组件
 * @param {*} vDom
 * @param {*} container
 */
export default function mountClassComponent(vDom, container) {
  const fn = vDom.type;
  // 循环组件的时候也是可以接受key的，这个key就默认放在第一个dom元素上就好了
  const key = vDom.props.key
  const component = new fn(vDom.props);

  // 执行函数，得到需要渲染的virtualDom对象
  const elementVirtualDom = component.render();

  // 把类组件实例对象绑定在虚拟对象上，方便后续收集真实的dom对象和利用旧的实例对象render方法去更新组件
  elementVirtualDom.component = component;
  // 保存key属性
  if (key) elementVirtualDom.props.key = key

  if (elementVirtualDom) {
    mountVdom(elementVirtualDom, container);
  } else {
    throw new Error(fn.name + "没有返回需要渲染的元素，请好好检查一下");
  }

  // 如果有ref属性，则去获取类组件的实例
  if (vDom.props && vDom.props.ref) vDom.props.ref(component);
  
  // 执行生命周期函数
  if (component?.componentDidMount) component.componentDidMount();
}
