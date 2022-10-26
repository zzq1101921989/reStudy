import React from './react';
import ReactDom from './react-dom';

const jsx = (
  <h1>
    <span>这是一个span标签</span>
    <p>这是儿子1div标签</p>
    <p>这是儿子2div标签</p>
  </h1>
);

const root = document.querySelector('#root');

ReactDom.render(jsx, root);