import React from "react";
import ZzqReact from "./ZzqReact";
import ZzqReactDom from './ZzqReactDom';

console.log(ZzqReact);

const dom = (
  <div className="container">
    <div>
      <p>这是橘子</p>
      <button>这是按钮</button>
      位置
    </div>
    {2 === 2 && <div>222</div>}
    {2 === 1 && <div>111</div>}
    <input type="text" value="123" />
    这只是一个文字
  </div>
);

ZzqReactDom.render(dom, document.querySelector('#root'))

