import diff from "../ZzqReactDom/diff";

/**
 * 所有类组件都需要继承的父类，这个父类里面包含了 props参数，setState方法，控制子组件更新等等一些列重要的方法
 */
export default class Component {
  constructor(props) {
    this.props = props;
  }
  setState(state) {
    // 先更新
    this.state = Object.assign({}, this.state, state)
    // 得出最新的virtualDom
    const newVirtualDom = this.render();
    // 找到类组件对应的真实dom
    const oldDom = this.getDom();
    // 实现对比更新
    diff(newVirtualDom, oldDom.parentNode, oldDom)
  }
  setDom(dom) {
    this._dom = dom
  }
  getDom() {
    return this._dom
  }
  updateProps(props) {
    this.props = props
  }

  /* ---------------------------- 生命周期方法 ---------------------------- */

  /* 组件挂载完成之后 */
  componentDidMount() {}

  /* 组件更新后，拿到的最新的props，但是此时组件还没有完全的更新完毕 */
  componentWillReceiveProps(props) {}

  /* 组件即将更新了 */
  componentWillUpdate(nextProps) {}

  /* 组件更新完毕之后，执行的方法 */
  componentDidUpdate() {}

  /* 是否更新组件？ */
  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  /* 组件卸载 */
  componentWillUnmount() {}
}
