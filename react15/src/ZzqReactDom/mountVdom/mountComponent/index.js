import { isFunctionComponent } from "../../utils";
import mountClassComponent from "./mountClassComponent";
import mountFunctionComponent from "./mountFunctionComponent";

/**
 * 函数组件挂载处理方法
 * @param {*} vDom 虚拟dom对象
 * @param {*} container 挂载容器
 */
export default function mountComponent(vDom, container) {
    // 判断当前的是函数组件呢？还是类组件呢？
    if (isFunctionComponent(vDom)) {
        mountFunctionComponent(vDom, container)
    } else {
        mountClassComponent(vDom, container)
    }
}