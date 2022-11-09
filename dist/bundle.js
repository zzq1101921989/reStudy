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
        var fiber = item;
        var parentFiber = item["return"];
        /**
         * effects数组构建的同时也会构建组件的fiber对象
         * 但其实组件的fiber对象并不是一个真实可以挂载的dom对象，所以需要过滤掉，并且一层层的往上找
         */

        while (parentFiber.tag === _util_tag__WEBPACK_IMPORTED_MODULE_2__.CLASS_COMPONENT || parentFiber.tag === _util_tag__WEBPACK_IMPORTED_MODULE_2__.FUNCTION_COMPONENT) {
          parentFiber = parentFiber["return"];
        }

        if (fiber.tag === _util_tag__WEBPACK_IMPORTED_MODULE_2__.HOST_COMPONENT) {
          parentFiber.stateNode.appendChild(fiber.stateNode);
        }
      }
    });
  }; // 执行单个工作任务


  function executeTask(fiber) {
    console.log(fiber, 'fiber');

    if (fiber.props.children) {
      if (fiber.tag === _util_tag__WEBPACK_IMPORTED_MODULE_2__.CLASS_COMPONENT) {
        reconciler(fiber, fiber.stateNode.render());
      } else if (fiber.tag === _util_tag__WEBPACK_IMPORTED_MODULE_2__.FUNCTION_COMPONENT) {
        reconciler(fiber, fiber.stateNode(fiber.props));
      } else {
        reconciler(fiber, fiber.props.children);
      }
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

/***/ "./react16/src/react/Component.js":
/*!****************************************!*\
  !*** ./react16/src/react/Component.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component)
/* harmony export */ });
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = /*#__PURE__*/_createClass(function Component(props) {
  _classCallCheck(this, Component);

  this.props = props;
});

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
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./react16/src/react/Component.js");
/* harmony import */ var _createElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createElement */ "./react16/src/react/createElement.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  createElement: _createElement__WEBPACK_IMPORTED_MODULE_1__["default"],
  Component: _Component__WEBPACK_IMPORTED_MODULE_0__.Component
});

/***/ }),

/***/ "./react16/src/util/createClassComponentInstance.js":
/*!**********************************************************!*\
  !*** ./react16/src/util/createClassComponentInstance.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createClassComponentInstance)
/* harmony export */ });
/**
 * 实例化类组件
 * @param {*} fiber 
 */
function createClassComponentInstance(fiber) {
  var instance = new fiber.type(fiber.props);
  return instance;
}

/***/ }),

/***/ "./react16/src/util/createDomElement.js":
/*!**********************************************!*\
  !*** ./react16/src/util/createDomElement.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createDomElement)
/* harmony export */ });
function createDomElement(fiber) {
  if (fiber.type === 'text') {
    return document.createTextNode(fiber.props.textContent);
  } else if (typeof fiber.type === 'string') {
    return document.createElement(fiber.type);
    updateNodeElementAttr(newElement, fiber.props);
  }
}

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
/* harmony import */ var _createClassComponentInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createClassComponentInstance */ "./react16/src/util/createClassComponentInstance.js");
/* harmony import */ var _createDomElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createDomElement */ "./react16/src/util/createDomElement.js");
/* harmony import */ var _tag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tag */ "./react16/src/util/tag.js");



/**
 * 当fiber中的tag === host_component的时候就需要创建dom元素
 * @param {*} fiber
 */

function createStateNode(fiber) {
  switch (fiber.tag) {
    /* 处理普通元素情况 */
    case _tag__WEBPACK_IMPORTED_MODULE_2__.HOST_COMPONENT:
      return (0,_createDomElement__WEBPACK_IMPORTED_MODULE_1__["default"])(fiber);

    /* 处理类组件的情况 */

    case _tag__WEBPACK_IMPORTED_MODULE_2__.CLASS_COMPONENT:
      return (0,_createClassComponentInstance__WEBPACK_IMPORTED_MODULE_0__["default"])(fiber);

    /* 处理函数组件的情况 */

    case _tag__WEBPACK_IMPORTED_MODULE_2__.FUNCTION_COMPONENT:
      return fiber.type;
  }
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
/* harmony export */   "CreateTaskQueue": () => (/* reexport safe */ _createTaskQueue__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "createClassComponentInstance": () => (/* reexport safe */ _createClassComponentInstance__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "createDomElement": () => (/* reexport safe */ _createDomElement__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "createStateNode": () => (/* reexport safe */ _createStateNode__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "toArray": () => (/* reexport safe */ _toArray__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var _createClassComponentInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createClassComponentInstance */ "./react16/src/util/createClassComponentInstance.js");
/* harmony import */ var _createDomElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createDomElement */ "./react16/src/util/createDomElement.js");
/* harmony import */ var _createStateNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createStateNode */ "./react16/src/util/createStateNode.js");
/* harmony import */ var _createTaskQueue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createTaskQueue */ "./react16/src/util/createTaskQueue.js");
/* harmony import */ var _toArray__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./toArray */ "./react16/src/util/toArray.js");






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
/* harmony import */ var _react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../react */ "./react16/src/react/index.js");

var HOST_ROOT = "hoot_root";
var HOST_COMPONENT = "hoot_component";
var FUNCTION_COMPONENT = "function_component";
var CLASS_COMPONENT = "class_component";
/**
 * 获取fiber中的tag属性
 * @param {*} vDom virtualDom节点
 */

function getTag(vDom) {
  switch (true) {
    case typeof vDom.type == "string":
      return HOST_COMPONENT;

    case Object.getPrototypeOf(vDom.type) === _react__WEBPACK_IMPORTED_MODULE_0__["default"].Component:
      return CLASS_COMPONENT;

    case typeof vDom.type === 'function':
      return FUNCTION_COMPONENT;
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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var jsx = /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("h1", null, /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("span", null, "\u8FD9\u662F\u4E00\u4E2Aspan\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, "\u8FD9\u662F\u513F\u5B501div\u6807\u7B7E"), /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("p", null, "\u8FD9\u662F\u513F\u5B502div\u6807\u7B7E"));

var Parent = /*#__PURE__*/function (_React$Component) {
  _inherits(Parent, _React$Component);

  var _super = _createSuper(Parent);

  function Parent(props) {
    _classCallCheck(this, Parent);

    return _super.call(this, props);
  }

  _createClass(Parent, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", null, "\u8FD9\u662F\u4E00\u4E2A\u7C7B\u7EC4\u4EF6");
    }
  }]);

  return Parent;
}(_react__WEBPACK_IMPORTED_MODULE_0__["default"].Component);

function FunComponent() {
  return /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", null, "\u8FD9\u662F\u4E00\u4E2A\u51FD\u6570\u7EC4\u4EF6");
}

var root = document.querySelector("#root"); // ReactDom.render(jsx, root);
// ReactDom.render(<Parent />, root);

_react_dom__WEBPACK_IMPORTED_MODULE_1__["default"].render( /*#__PURE__*/_react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(FunComponent, null), root);
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map