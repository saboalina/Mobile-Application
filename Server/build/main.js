require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var koa = __webpack_require__(/*! koa */ "koa");

var app = module.exports = new koa();

const server = __webpack_require__(/*! http */ "http").createServer(app.callback());

const WebSocket = __webpack_require__(/*! ws */ "ws");

const wss = new WebSocket.Server({
  server
});

const Router = __webpack_require__(/*! koa-router */ "koa-router");

const cors = __webpack_require__(/*! @koa/cors */ "@koa/cors");

const bodyParser = __webpack_require__(/*! koa-bodyparser */ "koa-bodyparser");

app.use(bodyParser());
app.use(cors());
app.use(middleware);

function middleware(ctx, next) {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log(`${start.toLocaleTimeString()} ${ctx.request.method} ${ctx.request.url} ${ctx.response.status} - ${ms}ms`);
  });
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const rules = [];
const names = ['entry', 'ground', 'main', 'top'];
const statuses = ['prepared', 'in-use', 'canceled', 'old'];

for (let i = 0; i < 50; i++) {
  rules.push({
    id: i + 1,
    name: names[getRandomInt(0, names.length)],
    level: getRandomInt(1, 10),
    status: statuses[getRandomInt(0, statuses.length)],
    from: getRandomInt(1, 10),
    to: getRandomInt(11, 20)
  });
}

const router = new Router();
router.get('/rules', ctx => {
  ctx.response.body = rules;
  ctx.response.status = 200;
});

const broadcast = data => wss.clients.forEach(client => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
});

router.post('/rule', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body; // console.log("body: " + JSON.stringify(headers));

  const name = headers.name;
  const level = headers.level;
  const from = headers.from;
  const to = headers.to;

  if (typeof name !== 'undefined' && typeof level !== 'undefined' && typeof from !== 'undefined' && typeof to !== 'undefined') {
    const index = rules.findIndex(obj => obj.name == name && obj.level == level);

    if (index !== -1) {
      console.log("Rule already exists!");
      ctx.response.body = {
        text: 'Rule already exists!'
      };
      ctx.response.status = 404;
    } else {
      let maxId = Math.max.apply(Math, rules.map(function (obj) {
        return obj.id;
      })) + 1;
      let obj = {
        id: maxId,
        name,
        level,
        status: statuses[0],
        from,
        to
      }; // console.log("created: " + JSON.stringify(name));

      rules.push(obj);
      broadcast(obj);
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid fields!");
    ctx.response.body = {
      text: 'Missing or invalid fields!'
    };
    ctx.response.status = 404;
  }
});
router.get('/rule/:id', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const id = headers.id;

  if (typeof id !== 'undefined') {
    const index = rules.findIndex(obj => obj.id == id);

    if (index === -1) {
      console.log("Rule not available!");
      ctx.response.body = {
        text: 'Rule not available!'
      };
      ctx.response.status = 404;
    } else {
      let obj = rules[index];
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid: id!");
    ctx.response.body = {
      text: 'Missing or invalid: id!'
    };
    ctx.response.status = 404;
  }
});
router.post('/update', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.request.body; // console.log("body: " + JSON.stringify(headers));

  const id = headers.id;
  const name = headers.name;
  const level = headers.level;
  const status = headers.status;
  const from = headers.from;
  const to = headers.to;

  if (typeof name !== 'undefined' && typeof level !== 'undefined' && typeof status !== 'undefined' && typeof from !== 'undefined' && typeof to !== 'undefined') {
    const index = rules.findIndex(obj => obj.id == id);

    if (index === -1) {
      console.log("Rule not available!");
      ctx.response.body = {
        text: 'Rule not available!'
      };
      ctx.response.status = 404;
    } else {
      let obj = rules[index];
      obj.name = name;
      obj.level = level;
      obj.status = status;
      obj.from = from;
      obj.to = to;
      ctx.response.body = obj;
      ctx.response.status = 200;
    }
  } else {
    console.log("Missing or invalid fields!");
    ctx.response.body = {
      text: 'Missing or invalid fields!'
    };
    ctx.response.status = 404;
  }
});
router.get('/level/:level', ctx => {
  // console.log("ctx: " + JSON.stringify(ctx));
  const headers = ctx.params;
  const level = headers.level;

  if (typeof level !== 'undefined') {
    ctx.response.body = rules.filter(obj => obj.level == level);
    ctx.response.status = 200;
  } else {
    console.log("Missing or invalid: level!");
    ctx.response.body = {
      text: 'Missing or invalid: level!'
    };
    ctx.response.status = 404;
  }
});
app.use(router.routes());
app.use(router.allowedMethods());
server.listen(2019);

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Facultate\An_3_semestrul_1\ExamenMobile\ExamenAccess\exam-2021-19-main\server\src/index.js */"./src/index.js");


/***/ }),

/***/ "@koa/cors":
/*!****************************!*\
  !*** external "@koa/cors" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@koa/cors");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "koa-bodyparser":
/*!*********************************!*\
  !*** external "koa-bodyparser" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),

/***/ "koa-router":
/*!*****************************!*\
  !*** external "koa-router" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("ws");

/***/ })

/******/ });
//# sourceMappingURL=main.map