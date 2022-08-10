import diff from './diff'

/**
 * react挂载渲染函数，通过调用render方法，把虚拟dom转换成真实的dom挂载到容器上
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 * @param {*} oldDom 旧dom，用于后续的diff对比更新节点
 */
export default function render(vDom, container, oldDom) {
    diff(vDom, container, oldDom)
}