import { createStateNode, CreateTaskQueue, toArray } from '../util';
import getTag, { HOST_ROOT } from '../util/tag';

const taskQueue = new CreateTaskQueue()

// 当前正在进行的任务
let subTask = null

// 是否构建完成
let isComplete = false;

/**
 * 挂载virtualDom，并且转换成Fiber
 * @param {*} virtualDom 
 * @param {*} container 
 */
export default function render(virtualDom, container) {

    /**
     * 构建最外层的fiber任务
     */
    function getFirstFiberTask () {
        let fiber = {
            props: { children: virtualDom },
            stateNode: container,
            tag: HOST_ROOT,
            effect: [],
            child: null,
        }
        return fiber
    }
    
    /**
     * 构建父子fiber关系
     * parentFiber 父fiber节点
     * virtualChilds 子virtualDom节点对象
     */
    function reconciler (parentFiber, virtualChilds) {

        /* 防止出现对象的情况，所以统一转换成数组 */
        const childrens = toArray(virtualChilds)

        console.log(parentFiber, 'parentFiber');

        /* 得出需要循环生成节点的次数 */
        let index = 0;

        /* 记得上一个生成的fiber节点，方便构建兄弟关系 */
        let preChildFiber = null;

        while (index < childrens.length) {

            /* 当前初始的virtualDom */
            const currentVirtualDom = childrens[index];

            const newFiber = {
                props: currentVirtualDom.props,
                type: currentVirtualDom.type,
                tag: getTag(currentVirtualDom),
                return: parentFiber,
                effect: [],
                effectTag: 'MOUNT',
                child: null,
                sibling: null,
            }

            newFiber.stateNode = createStateNode(newFiber);

            /* 构建父fiber的唯一一个子fiber节点 */
            if (!parentFiber.child) parentFiber.child = newFiber

            if (preChildFiber) {
                preChildFiber.sibling = newFiber
            }

            preChildFiber = newFiber

            index++
        }
    }

    // 执行单个工作任务
    function executeTask(fiber) {
        if (fiber.props.children) {
            reconciler(fiber, fiber.props.children)
        }
        if (fiber.child) {
            return fiber.child
        }
        if (fiber.sibling) {
            return fiber.sibling
        }
    }

    // 循环执行工作任务
    function wordLoop(deadline) {

        // 准备执行任务了？发现没有任务
        if (!subTask && !isComplete) {
            // 构建最外层的RootFiber对象
            subTask = getFirstFiberTask();
        }

        // 浏览器空余时间大于一毫秒的话，就可以进行工作了
        if (deadline.timeRemaining() > 1) {
            while (subTask) {
                subTask = executeTask(subTask)
            }
        }
    }

    // 调度任务
    function schedule (deadline) {
        wordLoop(deadline);
        /**
         * 当浏览器出现更高优先级的时候
         * deadline的空余时间将会小于1，就会走到下面这行代码来
         * 但是有高优先级的任务出现，并不代码渲染任务已经完成了，所以需要判断当前正在执行的任务和任务队列里面的任务是否完成
         * 如果没有，则继续进行
         */
        if (subTask || !taskQueue.isEmpty()) {
            requestIdleCallback(schedule)
        }
    }

    requestIdleCallback(schedule)
}