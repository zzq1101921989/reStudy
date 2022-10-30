import { createStateNode, CreateTaskQueue, toArray } from "../util";
import { PLACE_MENT } from "../util/effectTag";
import getTag, { HOST_ROOT } from "../util/tag";

const taskQueue = new CreateTaskQueue();

/* 当前正在进行的任务 */
let subTask = null;

/* 是否构建完成 */
let isComplete = false;

/* 准备提交渲染 */
let paddingCommit = null;

/**
 * 挂载virtualDom，并且转换成Fiber
 * @param {*} virtualDom
 * @param {*} container
 */
export default function render(virtualDom, container) {
  /**
   * 构建最外层的fiber任务
   */
  function getFirstFiberTask() {
    let fiber = {
      props: { children: virtualDom },
      stateNode: container,
      tag: HOST_ROOT,
      effects: [],
      child: null,
    };
    return fiber;
  }

  /**
   * 构建父子fiber关系
   * @params parentFiber 父fiber节点
   * @params virtualChilds 子virtualDom节点对象
   */
  function reconciler(parentFiber, virtualChilds) {
    /* 防止出现对象的情况，所以统一转换成数组 */
    const childrens = toArray(virtualChilds);

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
        effects: [],
        effectTag: PLACE_MENT,
        child: null,
        sibling: null,
      };

      newFiber.stateNode = createStateNode(newFiber);

      /* 构建父fiber的唯一一个子fiber节点 */
      if (!parentFiber.child) parentFiber.child = newFiber;

      if (preChildFiber) {
        preChildFiber.sibling = newFiber;
      }

      preChildFiber = newFiber;

      index++;
    }
  }

  /**
   * 提交渲染任务
   * @params filer 最顶层的 rootFiber 对象
   */
  const commitAllWork = filer => {
    filer.effects.forEach(item => {
        /* 挂载节点 */
        if (item.effectTag === PLACE_MENT) {
            item.return.stateNode.appendChild(item.stateNode)
        }
    })
  }

  // 执行单个工作任务
  function executeTask(fiber) {
    if (fiber.props.children) {
      reconciler(fiber, fiber.props.children);
    }

    /* 如果有子fiber节点，那就继续向下构建咯（深度优先遍历 --- 递归） */
    if (fiber.child) {
      return fiber.child;
    }

    /* 定义变量接收一下当前正在处理的fiber对象 */
    let currentHanlderFiber = fiber;

    /**
     * 如果没有子节点了，那就横向平移找到兄弟节点，尝试构建兄弟节点的子节点
     * 如果当前这一级的兄弟节点都完毕了，就返回到父级，查看父级有没有需要构建子节点的兄弟节点
     */
    while (currentHanlderFiber.return) {
      /* 构建父级的effects元素数组 */
      currentHanlderFiber.return.effects =
        currentHanlderFiber.return.effects.concat(
          currentHanlderFiber.effects.concat(currentHanlderFiber)
        );

      if (currentHanlderFiber.sibling) {
        return currentHanlderFiber.sibling;
      }
      currentHanlderFiber = currentHanlderFiber.return;
    }
    
    isComplete = true;
    paddingCommit = currentHanlderFiber;
  }

  // 循环执行工作任务
  function wordLoop(deadline) {
    // 准备执行任务了？发现没有任务
    if (!subTask && !isComplete) {
      // 构建最外层的RootFiber对象`
      subTask = getFirstFiberTask();
    }

    // 浏览器空余时间大于一毫秒的话，就可以进行工作了
    if (deadline.timeRemaining() > 1) {
      while (subTask) {
        subTask = executeTask(subTask);
      }

      if (paddingCommit) {
        commitAllWork(paddingCommit)
      }
    }
  }

  // 调度任务
  function schedule(deadline) {
    wordLoop(deadline);
    /**
     * 当浏览器出现更高优先级的时候
     * deadline的空余时间将会小于1，就会走到下面这行代码来
     * 但是有高优先级的任务出现，并不代码渲染任务已经完成了，所以需要判断当前正在执行的任务和任务队列里面的任务是否完成
     * 如果没有，则继续进行
     */
    if (subTask || !taskQueue.isEmpty()) {
      requestIdleCallback(schedule);
    }
  }

  requestIdleCallback(schedule);
}
