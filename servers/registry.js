'use strict';
// 引入nodejs的普通请求和跨域请求模块
var http = require('http');
var cors = require('kcors');
// 引入koa nodejs网络开发框架
var koa = require('koa');
// 引入一堆 基于koa的开源中间件
var middlewares = require('koa-middlewares');
var bodyParser = require('koa-bodyparser');
var rt = require('koa-rt');
var rewrite = require('koa-rewrite');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var maxrequests = require('koa-maxrequests');
// 引入一堆 registry 访问相关的路由配置
var routes = require('../routes/registry');
// 引入配置文件
var config = require('../config');

var block = require('../middleware/block');
var auth = require('../middleware/auth');
var staticCache = require('../middleware/static');
var notFound = require('../middleware/registry_not_found');
var proxyToNpm = require('../middleware/proxy_to_npm');
// 引入日志处理模块
var logger = require('../common/logger');

var app = module.exports = koa();

app.use(maxrequests());
app.use(block());
middlewares.jsonp(app);
app.use(rt({ headerName: 'X-ReadTime' }));
app.use(rewrite('/favicon.ico', '/favicon.png'));
app.use(staticCache);

app.keys = ['todokey', config.sessionSecret];
app.proxy = true;
app.use(bodyParser({ jsonLimit: config.jsonLimit, strict: false }));
app.use(cors({
  allowMethods: 'GET,HEAD',
}));
app.use(auth());
app.use(proxyToNpm());
app.use(notFound);

if (config.enableCompress) {
  app.use(middlewares.compress({ threshold: 150 }));
}
app.use(conditional());
app.use(etag());
// 配置路由
app.use(middlewares.router(app));
routes(app);

// 错误处理
app.on('error', function (err, ctx) {
  console.log(err);
  console.log(err.stack);
  err.url = err.url || ctx.request.url;
  logger.error(err);
});

app = http.createServer(app.callback());
// 如果为空
if (!module.parent) {
  app.listen(config.registryPort);
}

module.exports = app;
