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

ZzqReactDom.render(dom, document.querySelector('#root'))

