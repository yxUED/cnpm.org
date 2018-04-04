'use strict';
// 引入nodejs的文件、路径和请求模块
var fs = require('fs');
var path = require('path');
var http = require('http');
// koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。
// Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。
var koa = require('koa');
// 引入一堆 基于koa的开源中间件
var middlewares = require('koa-middlewares');
var bodyParser = require('koa-bodyparser');
var rt = require('koa-rt');
var rewrite = require('koa-rewrite');
var conditional = require('koa-conditional-get');
var etag = require('koa-etag');
var jsonp = require('koa-safe-jsonp');
var markdownMiddleware = require('koa-markdown');
var maxrequests = require('koa-maxrequests');
// 引入一堆 浏览器访问相关的路由配置
var routes = require('../routes/web');
// 引入配置文件
var config = require('../config');
// 引入本地开发的中间件
var block = require('../middleware/block');
var opensearch = require('../middleware/opensearch');
var notFound = require('../middleware/web_not_found');
var staticCache = require('../middleware/static');
var auth = require('../middleware/auth');
var proxyToNpm = require('../middleware/proxy_to_npm');
// 引入日志处理模块
var logger = require('../common/logger');
// 引入 支持 markdown 的配置
var renderMarkdown = require('../common/markdown').render;

var app = koa();
// 跨域请求
jsonp(app);

var rootdir = path.dirname(__dirname);

app.use(maxrequests());
app.use(block());
app.use(rt({ headerName: 'X-ReadTime' }));
app.use(rewrite('/favicon.ico', '/favicon.png'));
app.use(staticCache);
// 如果设置了页面假数据，从本地获取假数据，方便开发
if (config.pagemock) {
  app.use(require('koa-mock')({
    datadir: path.join(rootdir, 'test', 'mocks')
  }));
}

app.use(opensearch);
app.keys = ['todokey', config.sessionSecret];
app.proxy = true;
app.use(proxyToNpm({
  isWeb: true
}));
app.use(bodyParser({ jsonLimit: config.jsonLimit, strict: false }));
// 对请求进行鉴权
app.use(auth());
// 对页面不存在进行处理
app.use(notFound);
// 进行压缩相关的处理
if (config.enableCompress) {
  app.use(middlewares.compress({threshold: 150}));
}
// 一起对响应进行处理
app.use(conditional());
app.use(etag());
// 页面的路径
var viewDir = path.join(rootdir, 'view', 'web');
// 文档路径
var docDir = path.join(rootdir, 'docs', 'web');
// 页面模板
var layoutFile = path.join(viewDir, '_layout.html');
// 页面底部
var footer = config.customFooter || fs.readFileSync(path.join(viewDir, 'footer.html'), 'utf8');
var layout = fs.readFileSync(path.join(viewDir, 'layout.html'), 'utf8')
  .replace('{{footer}}', footer)
  .replace('{{logoURL}}', config.logoURL)
  .replace('{{adBanner}}', config.adBanner || '');
fs.writeFileSync(layoutFile, layout);

// custom web readme home page support
var readmeFile = path.join(docDir, '_readme.md');
var readmeContent;
if (config.customReadmeFile) {
  readmeContent = fs.readFileSync(config.customReadmeFile, 'utf8');
} else {
  readmeContent = fs.readFileSync(path.join(docDir, 'readme.md'), 'utf8');
}
fs.writeFileSync(readmeFile, readmeContent);
// 对markdown进行配置
app.use(markdownMiddleware({
  baseUrl: '/',
  root: docDir,
  layout: layoutFile,
  titleHolder: '<%= locals.title %>',
  bodyHolder: '<%- locals.body %>',
  indexName: '_readme',
  cache: true,
  render: function (content) {
    return renderMarkdown(content, false);
  },
}));

var locals = {
  config: config
};
// 配置页面渲染的模板
middlewares.ejs(app, {
  root: viewDir,
  viewExt: 'html',
  layout: '_layout',
  cache: config.viewCache,
  debug: config.debug,
  locals: locals
});

// 设置路由
app.use(middlewares.router(app));
routes(app);

// 错误处理
app.on('error', function (err, ctx) {
  err.url = err.url || ctx.request.url;
  console.log(err);
  console.log(err.stack);
  logger.error(err);
});
// 创建服务器
app = http.createServer(app.callback());

if (!module.parent) {
  app.listen(config.webPort);
}

module.exports = app;
