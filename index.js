// 开启严格模式，消除js语法的一些不合理、不严谨之处，减少一些怪异行为
'use strict';
// 引入工程的相关配置
var config = require('./config');

exports.loadConfig = config.loadConfig;
exports.config = config;

// 启动工程
exports.startWorker = function (customConfig) {
  config.loadConfig(customConfig);
  require('./worker');
};

// 开启同步config中配置的官方源
exports.startSync = function (customConfig) {
  config.loadConfig(customConfig);
  require('./sync');
};
