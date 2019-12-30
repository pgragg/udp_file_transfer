"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = require("./modules/process/pool");
var pool = new pool_1.Pool({ maxPoolSize: 1 });
pool.add({ id: 1 });
pool.add({ id: 21 });
var el = pool.allocate();
var el2 = pool.allocate();
console.log({ el: el });
console.log({ pool: pool });
