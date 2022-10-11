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
/* harmony import */ var _util_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/tag */ "./react16/src/util/tag.js");


var taskQueue = new _util__WEBPACK_IMPORTED_MODULE_0__.CreateTaskQueue(); // 当前正在进行的任务

var subTask = null; // 是否构建完成

var isComplete = false;
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
      tag: _util_tag__WEBPACK_IMPORTED_MODULE_1__.HOST_ROOT,
      effect: [],
      child: null
    };
    return fiber;
  }
  /**
   * 构建父子fiber关系
   * parentFiber 父fiber节点
   * virtualChilds 子virtualDom节点对象
   */


  function reconciler(parentFiber, virtualChilds) {
    /* 防止出现对象的情况，所以统一转换成数组 */
    var childrens = (0,_util__WEBPACK_IMPORTED_MODULE_0__.toArray)(virtualChilds);
    /**
     * 首先取出父fiber中的child属性，查看是否存在节点
     * 在fiber数据结构中，子fiber节点只能存在一个，其他的子节点都是第一个子节点的兄弟节点
     */

    var parentChild = parentFiber.child;
    /* 得出需要循环生成节点的次数 */

    var index = childrens.length - 1;
    /* 记得上一个生成的fiber节点，方便构建兄弟关系 */

    var preChildFiber = null;

    while (index >= 0) {
      var currentVirtualDom = childrens[index]; // TODO: 未完待续，接下来继续完成父子fiber节点的构建

      var newFiber = {
        props: {
          children: virtualDom
        },
        type: currentVirtualDom.type,
        tag: _util_tag__WEBPACK_IMPORTED_MODULE_1__.HOST_COMPONENT,
        "return": parentFiber,
        effect: [],
        effectTag: 'MOUNT',
        stateNode: null,
        child: null,
        sibling: null
      };
      /* 构建父fiber的唯一一个子fiber节点 */

      if (!parentChild) parentFiber.child = newFiber;

      if (preChildFiber) {
        preChildFiber.sibling = newFiber;
      }

      preChildFiber = newFiber;
      index--;
    }

    console.log(parentFiber, 'parentFiber');
  } // 执行单个工作任务


  function executeTask(fiber) {
    reconciler(fiber, fiber.props.children);
  } // 循环执行工作任务


  function wordLoop(deadline) {
    // 准备执行任务了？发现没有任务
    if (!subTask && !isComplete) {
      // 构建最外层的RootFiber对象
      subTask = getFirstFiberTask();
    } // 浏览器空余时间大于一毫秒的话，就可以进行工作了


    if (deadline.timeRemaining() > 1) {
      while (subTask) {
        subTask = executeTask(subTask);
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

/***/ "./react16/src/util/index.js":
/*!***********************************!*\
  !*** ./react16/src/util/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateTaskQueue": () => (/* reexport safe */ _createTaskQueue__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "toArray": () => (/* reexport safe */ _toArray__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _createTaskQueue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createTaskQueue */ "./react16/src/util/createTaskQueue.js");
/* harmony import */ var _toArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toArray */ "./react16/src/util/toArray.js");



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
/* harmony export */   "HOST_ROOT": () => (/* binding */ HOST_ROOT)
/* harmony export */ });
var HOST_ROOT = 'hoot_root';
var HOST_COMPONENT = 'hoot_component';
var FUNCTION_COMPONENT = 'function_component';
var CLASS_COMPONENT = 'class_component';

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


var jsx = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, "\u8FD9\u662F\u4E00\u4E2Ap\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", null, "\u8FD9\u662F\u513F\u5B501div\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", null, "\u8FD9\u662F\u513F\u5B502div\u6807\u7B7E")));
var root = document.querySelector('#root');
_react_dom__WEBPACK_IMPORTED_MODULE_1__["default"].render(jsx, root);
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map