import mountVDom from './mountVdom'

/**
 * diff算法去对比节点，看看是否是初始化挂载呢？还是需要通过diff算法进行对比更新节点
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 * @param {*} oldDom 旧dom，用于后续的diff对比更新节点
 */
export default function diff(vDom, container, oldDom) {
    if (!oldDom) {
        // 初始化挂载virtualDom节点
        mountVDom(vDom, container)
    } else {
        console.log('这里就是更新的操作')
    }
}