import React from "react";
import ZzqReact from "./ZzqReact";
import ZzqReactDom from './ZzqReactDom';

console.log(ZzqReact);

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
    这只是一个文字
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
    这只是一个文字，但是他更新了哦
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



// ZzqReactDom.render(dom, document.querySelector('#root'))
// ZzqReactDom.render(<Header title='这是参数的头部信息' />, document.querySelector('#root'))

ZzqReactDom.render(dom, document.querySelector('#root'))
setTimeout(() => {
  ZzqReactDom.render(dom2, document.querySelector('#root'))
}, [2000])

