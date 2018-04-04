// 开启严格模式，消除js语法的一些不合理、不严谨之处，减少一些怪异行为
'use strict';

// 导入node中的child_process模块，提供衍生子进程的功能
var childProcess = require('child_process');
// 导入Node.js 的path 模块，用于处理文件路径
var path = require('path');
// 导入util 模块，用于支持 Node.js 内部 API 的需求
var util = require('util');
// 一个 node 多进程处理库
var cfork = require('cfork');
// 引入配置文件
var config = require('./config');
// __dirname全局变量，存储的是文件所在的文件目录
var workerPath = path.join(__dirname, 'worker.js');
var syncPath = path.join(__dirname, 'sync');

// cluster是nodejs v0.6后引入的支持多进程多核处理的特性
// 使用node封装好的API、IPC通道和调度机可以非常简单的创建包括一个master进程下HTTP代理服务器
// + 多个worker进程多个HTTP应用服务器的架构
console.log('启动 cnpmjs.org 中...\n \n启用多核: %s\n 管理组: %j\n 私有源前缀: %j\n Npm源: %s\n 同步方式: %s',
  config.enableCluster, config.admins, config.scopes, config.sourceNpmRegistry, config.syncModel);

// 判断是否开启集群 进行多核处理
if (config.enableCluster) {
  forkWorker();
  if (config.syncModel !== 'none') {
    // 如果开启了同步功能，则同步包，不管是全量all, 还是同步一使用的exist
    forkSyncer();
  }
} else {
  // 只开启单进程 nodejs 服务器引擎
  require(workerPath);
  if (config.syncModel !== 'none') {
    // 同步包
    require(syncPath);
  }
}

// 启动 多个node服务器
function forkWorker() {
  // https://www.npmjs.com/package/cfork
  cfork({
    exec: workerPath,
    count: config.numCPUs,
  }).on('fork', function (worker) {
    console.log('[%s] [worker:%d] new worker start', Date(), worker.process.pid);
  }).on('disconnect', function (worker) {
    console.error('[%s] [master:%s] wroker:%s disconnect, suicide: %s, state: %s.',
      Date(), process.pid, worker.process.pid, worker.suicide, worker.state);
  }).on('exit', function (worker, code, signal) {
    var exitCode = worker.process.exitCode;
    var err = new Error(util.format('worker %s died (code: %s, signal: %s, suicide: %s, state: %s)',
      worker.process.pid, exitCode, signal, worker.suicide, worker.state));
    err.name = 'WorkerDiedError';
    console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid, err.stack);
  });
}

// 为多个node 进程同步包
function forkSyncer() {
  var syncer = childProcess.fork(syncPath);
  syncer.on('exit', function (code, signal) {
    var err = new Error(util.format('syncer %s died (code: %s, signal: %s, stdout: %s, stderr: %s)',
      syncer.pid, code, signal, syncer.stdout, syncer.stderr));
    err.name = 'SyncerWorkerDiedError';
    console.error('[%s] [master:%s] syncer exit: %s: %s',
      Date(), process.pid, err.name, err.message);
    setTimeout(forkSyncer, 1000);
  });
}
