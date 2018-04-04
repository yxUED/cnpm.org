'use strict';
// Node.js 异步异常的处理与domain模块解析
var graceful = require('graceful');
// 引入提供源的服务器
var registry = require('./servers/registry');
// 引入支持 浏览器访问 的服务器
var web = require('./servers/web');
// 引入配置信息
var config = require('./config');
// 引入日志服务
var logger = require('./common/logger');

// 根据配置的端口和域 启动web和registry两个服务器
registry.listen(config.registryPort, config.bindingHost);
web.listen(config.webPort, config.bindingHost);
// 在终端打印出服务器启动的有关信息
console.log(
  '[%s] [worker:%d] 服务器已经启动, 源服务器的端口为 %s:%d, web访问服务器为：%s:%d, cluster: %s',
  new Date(), process.pid,
  config.bindingHost, config.registryPort,
  config.bindingHost, config.webPort,
  config.enableCluster
);

graceful({
  server: [registry, web],
  error: function (err, throwErrorCount) {
    if (err.message) {
      err.message += ' (uncaughtException throw ' + throwErrorCount + ' times on pid:' + process.pid + ')';
    }
    console.error(err);
    console.error(err.stack);
    logger.error(err);
  }
});
