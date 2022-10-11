import React from './react';
import ReactDom from './react-dom';

const jsx = (
  <div>
    <p>这是一个p标签</p>
    <p>
      <div>这是儿子1div标签</div>
      <div>这是儿子2div标签</div>
    </p>
  </div>
);

const root = document.querySelector('#root');

ReactDom.render(jsx, root);