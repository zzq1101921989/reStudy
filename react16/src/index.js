import React from './react';
import ReactDom from './react-dom';

const jsx = <div>
    <p>这是一个p标签</p>
</div>

const root = document.querySelector('#root');

ReactDom.render(jsx, root);