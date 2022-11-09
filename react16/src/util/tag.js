import React from "../react";

export const HOST_ROOT = "hoot_root";
export const HOST_COMPONENT = "hoot_component";
export const FUNCTION_COMPONENT = "function_component";
export const CLASS_COMPONENT = "class_component";

/**
 * 获取fiber中的tag属性
 * @param {*} vDom virtualDom节点
 */
export default function getTag(vDom) {
  switch (true) {
    case typeof vDom.type == "string":
      return HOST_COMPONENT;
    case Object.getPrototypeOf(vDom.type) === React.Component:
      return CLASS_COMPONENT;
    case typeof vDom.type === 'function':
      return FUNCTION_COMPONENT;
  }
}
