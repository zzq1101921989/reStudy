import createClassComponentInstance from "./createClassComponentInstance";
import createDomElement from "./createDomElement";
import { CLASS_COMPONENT, FUNCTION_COMPONENT, HOST_COMPONENT } from "./tag";

/**
 * 当fiber中的tag === host_component的时候就需要创建dom元素
 * @param {*} fiber
 */
export default function createStateNode(fiber) {
  switch (fiber.tag) {
    /* 处理普通元素情况 */
    case HOST_COMPONENT:
      return createDomElement(fiber);

    /* 处理类组件的情况 */
    case CLASS_COMPONENT:
      return createClassComponentInstance(fiber);
      
    /* 处理函数组件的情况 */
    case FUNCTION_COMPONENT:
      return fiber.type;
  }
}
