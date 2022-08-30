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
    console.log(oldDom);
  }
  setDom(dom) {
    this._dom = dom
  }
  getDom() {
    return this._dom
  }
}
