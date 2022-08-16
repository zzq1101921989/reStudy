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
  </div>
);

const Header = () => {
  const onClick = () => {
    console.log('点击了')
  }
  return <h1 className="header" onClick={onClick}>这是一个头部的组件</h1>
}

class ClassHeader {
  render() {
    return <h1>这是一个类组件头部</h1>
  }
}

// ZzqReactDom.render(dom, document.querySelector('#root'))
ZzqReactDom.render(<ClassHeader />, document.querySelector('#root'))

