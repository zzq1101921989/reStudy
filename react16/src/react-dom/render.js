import { CreateTaskQueue } from '../util';

const taskQueue = new CreateTaskQueue()

// 当前正在进行的任务
const subTask = null

/**
 * 挂载virtualDom，并且转换成Fiber
 * @param {*} virtualDom 
 * @param {*} container 
 */
export default function render(virtualDom, container) {

    // 循环执行工作任务
    function wordLoop(deadline) {
        // 浏览器空余时间大于一毫秒的话，就可以进行工作了
        if (deadline.timeRemaining() > 1) {

        }
    }

    // 调度任务
    function schedule (deadline) {
        wordLoop(deadline);
        if (subTask || !taskQueue.isEmpty()) {
            requestIdleCallback(schedule)
        }
    }

    // 当一开始没有任务的时候
    if (!taskQueue.queue.length) {
        taskQueue.pushTask({
            dom: container,
            children: virtualDom
        })
    }

    requestIdleCallback(schedule)
}