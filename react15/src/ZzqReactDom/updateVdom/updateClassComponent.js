import diff from "../diff";

/**
 * 更新类组件
 * @param {*} componentNewVdom 新的组件对应的新virtualDom
 * @param {*} oldComponent 旧的实例对象
 * @param {HTMLElement} container 容器
 * @param {HTMLElement} oldDom 旧的真实dom
 */
export default function updateClassComponent(
  componentNewVdom,
  oldComponent,
  container,
  oldDom
) {
  /* 拿出新的props */
  const newProps = componentNewVdom.props;
  
  /* 执行生命周期 */
  oldComponent.componentWillReceiveProps(newProps);

  if (oldComponent.shouldComponentUpdate(componentNewVdom.props)) {
    let prevProps = oldComponent.props;

    /* 执行生命周期 */
    oldComponent.componentWillUpdate(newProps);

    /* 更新props */
    oldComponent.updateProps(newProps);

    /* 拿到更新props过后新的virtualDom */
    const newElementVirtualDom = oldComponent.render();

    /* 不要忘记更新对应的实例对象 */
    newElementVirtualDom.component = oldComponent;

    /* 对比更新 */
    diff(newElementVirtualDom, container, oldDom);

    oldComponent.componentDidUpdate(prevProps);
  }
}
