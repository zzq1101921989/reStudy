const express = require('express');

const app = express();

// 静态资源引入路径
app.use(express.static('dist'));

const template = `<html>
    <title>React Fiber</title>
    <body>
        <div id="root"></div>
    </body>
    <script src='bundle.js'></script>
</html>`

app.get("*", (req, res) => {
    res.send(template)
})

app.listen(3000, () => {console.log('启动服务器, 地址：localhost:3000')})