/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./react16/src/react-dom/index.js":
/*!****************************************!*\
  !*** ./react16/src/react-dom/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./react16/src/react-dom/render.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  render: _render__WEBPACK_IMPORTED_MODULE_0__["default"]
});

/***/ }),

/***/ "./react16/src/react-dom/render.js":
/*!*****************************************!*\
  !*** ./react16/src/react-dom/render.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util */ "./react16/src/util/index.js");
/* harmony import */ var _util_effectTag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/effectTag */ "./react16/src/util/effectTag.js");
/* harmony import */ var _util_tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/tag */ "./react16/src/util/tag.js");



var taskQueue = new _util__WEBPACK_IMPORTED_MODULE_0__.CreateTaskQueue();
/* 当前正在进行的任务 */

var subTask = null;
/* 是否构建完成 */

var isComplete = false;
/* 准备提交渲染 */

var paddingCommit = null;
/**
 * 挂载virtualDom，并且转换成Fiber
 * @param {*} virtualDom
 * @param {*} container
 */

function render(virtualDom, container) {
  /**
   * 构建最外层的fiber任务
   */
  function getFirstFiberTask() {
    var fiber = {
      props: {
        children: virtualDom
      },
      stateNode: container,
      tag: _util_tag__WEBPACK_IMPORTED_MODULE_2__.HOST_ROOT,
      effects: [],
      child: null
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
    var childrens = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(virtualChilds);
    /* 得出需要循环生成节点的次数 */

    var index = 0;
    /* 记得上一个生成的fiber节点，方便构建兄弟关系 */

    var preChildFiber = null;

    while (index < childrens.length) {
      /* 当前初始的virtualDom */
      var currentVirtualDom = childrens[index];
      var newFiber = {
        props: currentVirtualDom.props,
        type: currentVirtualDom.type,
        tag: (0,_util_tag__WEBPACK_IMPORTED_MODULE_2__["default"])(currentVirtualDom),
        "return": parentFiber,
        effects: [],
        effectTag: _util_effectTag__WEBPACK_IMPORTED_MODULE_1__.PLACE_MENT,
        child: null,
        sibling: null
      };
      newFiber.stateNode = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createStateNode)(newFiber);
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


  var commitAllWork = function commitAllWork(filer) {
    filer.effects.forEach(function (item) {
      /* 挂载节点 */
      if (item.effectTag === _util_effectTag__WEBPACK_IMPORTED_MODULE_1__.PLACE_MENT) {
        item["return"].stateNode.appendChild(item.stateNode);
      }
    });
  }; // 执行单个工作任务


  function executeTask(fiber) {
    if (fiber.props.children) {
      reconciler(fiber, fiber.props.children);
    }
    /* 如果有子fiber节点，那就继续向下构建咯（深度优先遍历 --- 递归） */


    if (fiber.child) {
      return fiber.child;
    }
    /* 定义变量接收一下当前正在处理的fiber对象 */


    var currentHanlderFiber = fiber;
    /**
     * 如果没有子节点了，那就横向平移找到兄弟节点，尝试构建兄弟节点的子节点
     * 如果当前这一级的兄弟节点都完毕了，就返回到父级，查看父级有没有需要构建子节点的兄弟节点
     */

    while (currentHanlderFiber["return"]) {
      /* 构建父级的effects元素数组 */
      currentHanlderFiber["return"].effects = currentHanlderFiber["return"].effects.concat(currentHanlderFiber.effects.concat(currentHanlderFiber));

      if (currentHanlderFiber.sibling) {
        return currentHanlderFiber.sibling;
      }

      currentHanlderFiber = currentHanlderFiber["return"];
    }

    isComplete = true;
    paddingCommit = currentHanlderFiber;
  } // 循环执行工作任务


  function wordLoop(deadline) {
    // 准备执行任务了？发现没有任务
    if (!subTask && !isComplete) {
      // 构建最外层的RootFiber对象`
      subTask = getFirstFiberTask();
    } // 浏览器空余时间大于一毫秒的话，就可以进行工作了


    if (deadline.timeRemaining() > 1) {
      while (subTask) {
        subTask = executeTask(subTask);
      }

      if (paddingCommit) {
        commitAllWork(paddingCommit);
      }
    }
  } // 调度任务


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

/***/ }),

/***/ "./react16/src/react/createElement.js":
/*!********************************************!*\
  !*** ./react16/src/react/createElement.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createElement)
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createElement(type, props) {
  var _ref;

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var newChildren = (_ref = []).concat.apply(_ref, children).reduce(function (acc, next) {
    if (next !== false && next !== true && next !== null) {
      if (next instanceof Object) {
        acc.push(next);
      } else {
        acc.push(createElement('text', {
          textContent: next
        }));
      }
    }

    return acc;
  }, []);

  return {
    type: type,
    props: _objectSpread(_objectSpread({}, props), {}, {
      children: newChildren
    })
  };
}

/***/ }),

/***/ "./react16/src/react/index.js":
/*!************************************!*\
  !*** ./react16/src/react/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createElement */ "./react16/src/react/createElement.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  createElement: _createElement__WEBPACK_IMPORTED_MODULE_0__["default"]
});

/***/ }),

/***/ "./react16/src/util/createStateNode.js":
/*!*********************************************!*\
  !*** ./react16/src/util/createStateNode.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createStateNode)
/* harmony export */ });
/* harmony import */ var _updateNodeElementAttr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateNodeElementAttr */ "./react16/src/util/updateNodeElementAttr.js");

/**
 * 当fiber中的tag === host_component的时候就需要创建dom元素
 * @param {*} fiber 
 */

function createStateNode(fiber) {
  var newElement = null;

  if (fiber.type === 'text') {
    newElement = document.createTextNode(fiber.props.textContent);
  } else {
    newElement = document.createElement(fiber.type);
    (0,_updateNodeElementAttr__WEBPACK_IMPORTED_MODULE_0__["default"])(newElement, fiber.props);
  }

  return newElement;
}

/***/ }),

/***/ "./react16/src/util/createTaskQueue.js":
/*!*********************************************!*\
  !*** ./react16/src/util/createTaskQueue.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateTaskQueue)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CreateTaskQueue = /*#__PURE__*/function () {
  function CreateTaskQueue() {
    _classCallCheck(this, CreateTaskQueue);

    this.queue = [];
  }

  _createClass(CreateTaskQueue, [{
    key: "pushTask",
    value: function pushTask(task) {
      this.queue.push(task);
    }
  }, {
    key: "getTask",
    value: function getTask() {
      return this.queue.shift();
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.queue.length === 0;
    }
  }]);

  return CreateTaskQueue;
}();



/***/ }),

/***/ "./react16/src/util/effectTag.js":
/*!***************************************!*\
  !*** ./react16/src/util/effectTag.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PLACE_MENT": () => (/* binding */ PLACE_MENT)
/* harmony export */ });
var PLACE_MENT = 'placement';

/***/ }),

/***/ "./react16/src/util/index.js":
/*!***********************************!*\
  !*** ./react16/src/util/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateTaskQueue": () => (/* reexport safe */ _createTaskQueue__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "createStateNode": () => (/* reexport safe */ _createStateNode__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "toArray": () => (/* reexport safe */ _toArray__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _createStateNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createStateNode */ "./react16/src/util/createStateNode.js");
/* harmony import */ var _createTaskQueue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createTaskQueue */ "./react16/src/util/createTaskQueue.js");
/* harmony import */ var _toArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./toArray */ "./react16/src/util/toArray.js");




/***/ }),

/***/ "./react16/src/util/tag.js":
/*!*********************************!*\
  !*** ./react16/src/util/tag.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CLASS_COMPONENT": () => (/* binding */ CLASS_COMPONENT),
/* harmony export */   "FUNCTION_COMPONENT": () => (/* binding */ FUNCTION_COMPONENT),
/* harmony export */   "HOST_COMPONENT": () => (/* binding */ HOST_COMPONENT),
/* harmony export */   "HOST_ROOT": () => (/* binding */ HOST_ROOT),
/* harmony export */   "default": () => (/* binding */ getTag)
/* harmony export */ });
var HOST_ROOT = 'hoot_root';
var HOST_COMPONENT = 'hoot_component';
var FUNCTION_COMPONENT = 'function_component';
var CLASS_COMPONENT = 'class_component';
/**
 * 获取fiber中的tag属性
 * @param {*} vDom virtualDom节点
 */

function getTag(vDom) {
  switch (true) {
    case typeof vDom.type == 'string':
      return HOST_COMPONENT;
  }
}

/***/ }),

/***/ "./react16/src/util/toArray.js":
/*!*************************************!*\
  !*** ./react16/src/util/toArray.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toArray)
/* harmony export */ });
function toArray(arg) {
  return Array.isArray(arg) ? arg : [arg];
}

/***/ }),

/***/ "./react16/src/util/updateNodeElementAttr.js":
/*!***************************************************!*\
  !*** ./react16/src/util/updateNodeElementAttr.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ updateNodeElementAttr)
/* harmony export */ });
/**
 * 更新节点的属性，比如className、实践、style、type、value、data-xxx等
 * @param {HTMLElement} element 需要绑定属性的html元素
 * @param {*} newProps 新的属性对象，key代表属性名称，value代表属性的值
 * @param {*} oldProps 旧的属性对象，用于和新的props作对比，从而找出差异的部分
 */
function updateNodeElementAttr(element, newProps) {
  var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // 正常的进行遍历
  Object.keys(newProps).forEach(function (propName) {
    var newPropValue = newProps[propName];
    var oldPropValue = oldProps[propName];

    if (newPropValue !== oldPropValue) {
      // 绑定事件
      if (isBindEvent(propName)) {
        var eventName = propName.toLowerCase().slice(2);
        element.addEventListener(eventName, newPropValue);

        if (oldPropValue) {
          element.removeEventListener(eventName, oldPropValue);
        }
      } // 绑定表单的属性
      else if (isBindInputHtmlAttr(propName)) {
        element[propName] = newPropValue;
      } // 是否绑定类名
      else if (isBindClassName(propName)) {
        element.setAttribute("class", newPropValue);
      } // 行内样式表
      else if (isBindStyle(propName)) {
        handlerCssStyle(element, newPropValue);
      } else if (propName !== "children" && propName !== "ref") {
        element.setAttribute(propName, newPropValue);
      }
    }
  }); // 既然有了oldProps，那就证明是更新的时候了，看看有没有需要删除的属性

  Object.keys(oldProps).forEach(function (propName) {
    var newPropValue = newProps[propName];
    var oldPropValue = oldProps[propName];

    if (!newPropValue) {
      if (isBindEvent(propName)) {
        element.removeEventListener(propName, oldPropValue);
      } else {
        element.removeAttribute(propName);
      }
    }
  });
}
/**
 * 当前的属性是否是事件属性
 * @param {*} key 属性名称
 * @return {boolean}
 */

function isBindEvent(key) {
  return key.slice(0, 2) === "on";
}
/**
 * 当前的属性是否是表单相关的
 * @param {*} key 属性名称
 * @return {boolean}
 */


function isBindInputHtmlAttr(key) {
  return ["value", "checked"].includes(key);
}
/**
 * 当前的属性是否是类名
 * @param {*} key 属性名称
 * @return {boolean}
 */


function isBindClassName(key) {
  return key === "className";
}
/**
 * 当前的属性是否是行内样式
 * @param {*} key 属性名称
 * @return {boolean}
 */


function isBindStyle(key) {
  return key === "style";
}
/**
 * 处理style样式
 * @param {HTMLElement} element
 * @param {Object} styleValue
 * @return {string} 返回的是 width: 100px;height: 100px 类似这种css文本
 */


function handlerCssStyle(element, styleValue) {
  if (styleValue instanceof Object) {
    Object.keys(styleValue).map(function (propName) {
      var value = styleValue[propName];
      element.style[propName] = value;
    });
  } else {
    throw new Error("暂时只支持传入对象类型的style属性");
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./react16/src/index.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./react */ "./react16/src/react/index.js");
/* harmony import */ var _react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./react-dom */ "./react16/src/react-dom/index.js");


var jsx = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h1", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("span", null, "\u8FD9\u662F\u4E00\u4E2Aspan\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, "\u8FD9\u662F\u513F\u5B501div\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, "\u8FD9\u662F\u513F\u5B502div\u6807\u7B7E"));
var root = document.querySelector('#root');
_react_dom__WEBPACK_IMPORTED_MODULE_1__["default"].render(jsx, root);
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map