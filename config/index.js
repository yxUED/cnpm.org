'use strict';

// 引入mkdirp 来生成创建文件夹中间所有层级
var mkdirp = require('mkdirp');
// 引入copy-to更快的复制文件
var copy = require('copy-to');
// 引入node的path，fs和os模块
var path = require('path');
var fs = require('fs');
var os = require('os');

// 项目的版本号
var version = require('../package.json').version;
var root = path.dirname(__dirname);
var dataDir = path.join(process.env.HOME || root, '.cnpmjs.org');

var config = {
  version: version,
  dataDir: dataDir,
  // 是否开启多核
  enableCluster: false,
  numCPUs: os.cpus().length,
  // 终端访问的端口
  registryPort: 7001,
  // 浏览器访问的端口
  webPort: 7002,
  // 开启的话只能本机访问
  // bindingHost: '127.0.0.1',
  // 调试模式：一些中间件可能不加载，并且会打印日志
  debug: process.env.NODE_ENV === 'development',
  // page mode, enable on development env
  pagemock: process.env.NODE_ENV === 'development',
  // session 密钥
  sessionSecret: 'cnpmjs.org test session secret',
  // 设定最大的json数据为10m
  jsonLimit: '10mb',
  // 日志路径
  logdir: path.join(dataDir, 'logs'),
  // update file template dir
  uploadDir: path.join(dataDir, 'downloads'),
  // web page viewCache
  viewCache: false,

  // koa-limit 中间件 限制下载速度的配置
  limit: {
    enable: false,
    token: 'koa-limit:download',
    limit: 1000,
    interval: 1000 * 60 * 60 * 24,
    whiteList: [],
    blackList: [],
    message: 'request frequency limited, any question, please contact fengmk2@gmail.com',
  },
  // 是否开启 压缩返回 的数据
  enableCompress: false,
  // 默认系统管理员
  admins: {
    // name: email
    admin: 'admin@cnpmjs.org',
  },

  // 错误日志发送的邮件配置
  mail: {
    enable: false,
    appname: 'cnpmjs.org',
    from: 'cnpmjs.org mail sender <adderss@gmail.com>',
    service: 'gmail',
    auth: {
      user: 'address@gmail.com',
      pass: 'your password'
    }
  },
  // 用浏览器访问时的logo图片
  logoURL: 'https://os.alipayobjects.com/rmsportal/oygxuIUkkrRccUz.jpg',
  adBanner: '',
  customReadmeFile: '', // 自我定制Readme 的路径
  customFooter: '', // web访问时底部的信息
  npmClientName: 'cnpm', // 使用的客户端，也可以用 npm
  packagePageContributorSearch: true, // 包的主页是否调整到搜索页

  // 最大的依赖
  maxDependencies: 200,
  backupFilePrefix: '/cnpm/backup/',

  // 数据库配置
  database: {
    db: 'cnpmjs_test',
    username: 'root',
    password: '',
    // 配置使用的数据库，目前支持 'mysql', 'sqlite', 'postgres', 'mariadb'
    dialect: 'sqlite',
    // 数据库的ip
    host: '127.0.0.1',
    // 数据库的端口
    port: 3306,

    // 使用数据库连接池 进行负载均衡和提高速度，目前仅支持mysql 和 postgresql
    pool: {
      maxConnections: 10,
      minConnections: 0,
      maxIdleTime: 30000
    },

    // 'sqlite'存储引擎，默认存在 ~/.cnpmjs.org/data.sqlite
    storage: path.join(dataDir, 'data.sqlite'),
    logging: !!process.env.SQL_DEBUG,
  },

  // 默认本地文件系统的打包工具
  nfs: require('fs-cnpm')({
    dir: path.join(dataDir, 'nfs')
  }),
  // 如果为true, 302 将重定向到 `nfs.url(dist.key)`
  downloadRedirectToNFS: false,
  // 一般注掉，否则安装就不会走 内部设置的源
  // registryHost: 'r.cnpmjs.org',
  // 为true时: 只有admins(管理组) 发布内部包, 普通用户只能从 npm 源同步包, false时，所有用户都可以发布包
  enablePrivate: false,
  // 设置企业内部库的范围
  scopes: [ '@yx', '@yixin'],
  // 有些包已经存在 官方源，但是我们希望把他们作为内部包
  privatePackages: [],

  // 以下为同步官方源 包的设置
  // 官方的 npm registry，一般不要改
  officialNpmRegistry: 'https://registry.npmjs.com',
  officialNpmReplicate: 'https://replicate.npmjs.com',

  // 同步源, upstream registry 如果想直接从官方源同步
  // please drop them an email first
  sourceNpmRegistry: 'https://registry.npm.taobao.org',
  // 如果 upstream 是官方源， 请设为false
  sourceNpmRegistryIsCNpm: true,
  // 如果安装返回 404, 尝试去官方源同步
  syncByInstall: true,

  // 同步模式：none: 不同步任何的包 exist: 只同步已存在的模块 all: 全量同步
  syncModel: 'none',
  // 并发同步
  syncConcurrency: 1,
  // 默认10分钟自动 同步一次
  syncInterval: '10m',

  // 同步最受欢迎的包
  syncPopular: false,
  syncPopularInterval: '1h',
  topPopular: 100,

  // 是否同步开发环境 下的依赖
  syncDevDependencies: false,
  // 从 original registry 同步删除的版本
  syncDeletedVersions: true,

  // changes streaming sync
  syncChangesStream: false,
  handleSyncRegistry: 'http://127.0.0.1:7001',

  // badge subject on http://shields.io/
  badgePrefixURL: 'https://img.shields.io/badge',
  badgeSubject: 'cnpm',

  // 是否启用 定制的用户账号体系，null默认使用本工程的
  userService: null,
  // 强制 鉴权
  alwaysAuth: false,
  // 如果有防火墙，则需要开启代理
  httpProxy: null,
  // snyk.io root url
  snykUrl: 'https://snyk.io',

  // https://github.com/cnpm/cnpmjs.org/issues/1149
  // if enable this option, must create module_abbreviated and package_readme table in database
  enableAbbreviatedMetadata: false,

  // global hook function: function* (envelope) {}
  // envelope format please see https://github.com/npm/registry/blob/master/docs/hooks/hooks-payload.md#payload
  globalHook: null,

  opensearch: {
    host: '',
  },
};

if (process.env.NODE_ENV === 'test') {
  config.enableAbbreviatedMetadata = true;
}

if (process.env.NODE_ENV !== 'test') {
  var customConfig;
  if (process.env.NODE_ENV === 'development') {
    customConfig = path.join(root, 'config', 'config.js');
  } else {
    // 1. try to load `$dataDir/config.json` first, not exists then goto 2.
    // 2. load config/config.js, everything in config.js will cover the same key in index.js
    customConfig = path.join(dataDir, 'config.json');
    if (!fs.existsSync(customConfig)) {
      customConfig = path.join(root, 'config', 'config.js');
    }
  }
  if (fs.existsSync(customConfig)) {
    copy(require(customConfig)).override(config);
  }
}

mkdirp.sync(config.logdir);
mkdirp.sync(config.uploadDir);

module.exports = config;

config.loadConfig = function (customConfig) {
  if (!customConfig) {
    return;
  }
  copy(customConfig).override(config);
};
