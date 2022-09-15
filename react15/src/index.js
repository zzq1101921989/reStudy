import React from "react";
import ZzqReact from "./ZzqReact";
import ZzqReactDom from './ZzqReactDom';

const dom = (
  <div className="container">
    <div data-text="text">
      <p>这是橘子</p>
      <button onClick={() => {
        console.log('按钮的方法');
      }}>这是按钮</button>
      位置
    </div>
    {2 === 2 && <div>222</div>}
    {2 === 1 && <div>111</div>}
    <input type="text" value="123" />
    待会这个文字就会被删除了！！！！
    <div style={{
      width: '100px',
      height: '100px',
      backgroundColor: '#000',
      borderRadius: '50%',
      textAlign: 'center',
      lineHeight: '100px',
      color: '#fff'
    }}>这是一个球</div>
    <h1>这是一个变化的标题哦</h1>
  </div>
);

const dom2 = (
  <div className="container111">
    <div data-text="text222">
      <p>这是更新过后的一个橘子</p>
      <button onClick={() => {
        console.log('按钮的方法，更新了哦');
      }}>这是按钮</button>
      位置
    </div>
    {2 === 2 && <div>222</div>}
    {2 === 1 && <div>111</div>}
    <input type="text" value="999" />
    <div style={{
      width: '100px',
      height: '100px',
      backgroundColor: '#000',
      borderRadius: '50%',
      textAlign: 'center',
      lineHeight: '100px',
      color: '#fff'
    }}>这是一个球111</div>
    <h3>这是一个变化的标题哦</h3>
  </div>
);

class ClassHeader extends ZzqReact.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div>
      <div>姓名: {this.props.name}</div>
      <div>年龄: {this.props.age}</div>
    </div>
  }
}

const Header = (props) => {
  const onClick = () => {
    console.log('点击了')
  }
  return <h1 className="header" onClick={onClick}>
    {props.title}
    这是一个头部的组件
    <ClassHeader name='zzq' age='18' />
  </h1>
}

class OpenMessageChildren extends ZzqReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'zzq'
    }
  }
  handlerClick = () => {
    
  }
  render() {
    return <div>
      <div>标题内容是: {this.props.title}</div>
      <div>名字是: {this.state.name}</div>
    </div>
  } 
}

class OpenMessage extends ZzqReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '这是一个默认的标题哦',
      list: [
        '这是第一条数据',
        '这是第二条数据',
        '这是第三条数据',
        '这是第四条数据',
      ]
    }
    this.buttonDom = null;
    this.instance = null;
  }
  handlerUpdateTitle = () => {
    console.log(this.buttonDom);
    console.log(this.instance);
    this.setState({
      title: '这是一个变化的标题了',
    })
  }

  /* 调换数据的位置 */
  handlerDataOrder = () => {
    const endData = this.state.list.slice(-1)[0]
    this.state.list.pop();
    this.state.list.unshift(endData)
    this.setState({
      list: [...this.state.list]
    })
  }

  /* 删除元素 */
  handlerDeleteData = () => {
    // 去掉最后一个
    const newData = this.state.list.filter((item, index) => index !== this.state.list.length - 1)
    this.setState({
      list: [...newData]
    })
  }

  componentWillReceiveProps(newProps) {
    console.log('这是新的props', newProps);
  }

  componentDidMount() {
    console.log('组件挂载完成');
  }

  componentDidUpdate() {
    console.log('更新完成');
  }

  render() {
    return <div>
      {/* {this.props.name}
      {this.props.age}
      <div>标题内容是: {this.state.title}</div>
      <OpenMessageChildren ref={(instance) => this.instance = instance} title={this.state.title} />
      <button ref={(dom) => this.buttonDom = dom} onClick={this.handlerUpdateTitle}>更新标题内容</button>
      <br/>
      <br/> */}
      {
        this.state.list.map(item => <div key={item}>{item}</div>)
        // this.state.list.map(item => <div>{item}</div>)
      }
      {/* <button onClick={this.handlerDataOrder}>改变数据的顺序</button> */}
      <button onClick={this.handlerDeleteData}>删除最后一个元素</button>
    </div>
  }
}

class NewOpenMessage extends ZzqReact.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <div>这是一个新的组件哦</div>
  }
}


// ZzqReactDom.render(dom, document.querySelector('#root'))
// ZzqReactDom.render(<Header title='这是参数的头部信息' />, document.querySelector('#root'))

// ZzqReactDom.render(dom, document.querySelector('#root'))
// setTimeout(() => {
//   ZzqReactDom.render(dom2, document.querySelector('#root'))
// }, [2000])

ZzqReactDom.render(
  <OpenMessage name='zzq' age='18' />, document.querySelector('#root')
)

// setTimeout(() => {
//   ZzqReactDom.render(
//     <NewOpenMessage />, document.querySelector('#root')
//   )
// }, 2000)
// setTimeout(() => {
//   ZzqReactDom.render(
//     <OpenMessage name='变化的zzq' age='24' />, document.querySelector('#root')
//   )
// }, 2000)

