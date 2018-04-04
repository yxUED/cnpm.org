# cnpmjs.org 注释及优化

### 项目缘起
感谢原cnpmjs.org的大神们提供的企业内部npm私有源解决方案，为了方便大家投入使用和进行二次开发，特在此对源码进行详细注释；  
目前 阿里、腾讯、美团等大都数互联网公司都基于此工程搭建了企业内部私有源或者npm镜像，如淘宝镜像。

### 项目源码
https://github.com/cnpm/cnpmjs.org/

### 如何开始
- 下载代码： git clone  https://github.com/yxUED/cnpm.org.git
- 进入项目根目录： cd cnpm.org
- 安装依赖： npm install
- 以开发方式启动： npm run dev
- 浏览器访问：http://127.0.0.1:7002/
- 命令行访问：安装cnpm后，cnpm set registry='http://127.0.0.1:7001/' 后进行cnpm login等操作
- 然后通过打断点 去了解代码 运行的过程，把注释写到这里或对应文件位置

### 结构目录
```
.
├── CONTRIBUTING.md             // 如何参与开源项目的开发维护文档
├── Dockerfile                  // dockerfike快速创建自定义的Docker镜像
├── LICENSE.txt                 // 开源协议
├── README.md                   // 项目介绍文档，即本文档
├── bin                    // 可行文件所在目录
│   ├── change_password.js      // 使用本工程默认账户体系 修改用户密码 命令
│   ├── cli.js                  // 客户端命令程序, 一般使用npm安装到全局时会调用
│   └── nodejsctl               // package.json配置的start stop status 等命令
├── common                // 公共中间件目录
│   ├── logger.js               // 日志处理
│   ├── mail.js                 // 邮件配置
│   ├── markdown.js             // 支持 markdown 书写格式
│   ├── nfs.js                  // 文件打包
│   ├── sequelize.js            // 数据处理
│   └── urllib.js               // url处理
├── config               // 配置目录
│   └── index.js                // 配置服务器的端口，数据库等
├── controllers          // 控制器目录
│   ├── registry            // 源的控制器目录
│   ├── sync.js                 // 同步包的控制器
│   ├── sync_module_worker.js   // 同步模块
│   ├── total.js                // 统计包的控制器
│   ├── utils.js                // 工具控制器
│   └── web                 // web端访问的控制器目录
├── dispatch.js                 // 本地开发的启动文件
├── docker-compose.yml          // docker合成配置
├── docs                 //文档目录
│   ├── Migrating-from-1.x-to-2.x.md
│   ├── db.sql
│   ├── dockerize
│   ├── flow
│   ├── network.png
│   ├── network.puml
│   ├── registry-api.md
│   ├── update_sqls
│   └── web
├── index.js                    // npm 引入项目目录时的入口文件
├── lib                  // 库目录
│   └── common.js               // 一些公共函数
├── middleware           // 中间件目录
│   ├── auth.js                 // 账号相关
│   ├── block.js                // 限制 ruby访问
│   ├── editable.js             // 包编辑权限控制
│   ├── exists_package.js       // 检查包是否存在
│   ├── limit.js                // 限流
│   ├── login.js                // 登录处理
│   ├── opensearch.js           // 打开搜索页
│   ├── proxy_to_npm.js         // 代理设置
│   ├── publishable.js          // 发布控制
│   ├── registry_not_found.js   // 处理请求 包 不存在
│   ├── static.js               // 静态资源处理
│   ├── sync_by_install.js      // 安装时 是否同步处理
│   ├── unpublishable.js        // 移除已经发布的包
│   └── web_not_found.js        // 处理请求的网页不存在
├── models               // 数据库目录
│   ├── _module_maintainer_class_methods.js
│   ├── download_total.js       // 获取所有下载量统计
│   ├── index.js
│   ├── init_script.js
│   ├── module.js
│   ├── module_abbreviated.js
│   ├── module_deps.js
│   ├── module_keyword.js
│   ├── module_log.js
│   ├── module_maintainer.js
│   ├── module_star.js
│   ├── module_unpublished.js
│   ├── npm_module_maintainer.js
│   ├── package_readme.js
│   ├── tag.js
│   ├── total.js
│   ├── user.js
│   └── utils.js
├── node_modules                // 第三方应用库 安装目录
├── package-lock.json
├── package.json                // 项目配置、介绍、依赖库和脚本
├── public            // 公共资源目录    
│   ├── css
│   ├── favicon.png
│   └── js
├── routes            // 路由目录
│   ├── registry.js             // 包请求 源路由配置
│   └── web.js                  // web 请求相关配置
├── servers           // 服务器目录
│   ├── registry.js             // 源服务器配置
│   └── web.js                  // web服务器配置
├── services          // 服务目录
│   ├── common.js
│   ├── default_user_service.js
│   ├── download_total.js
│   ├── hook.js
│   ├── module_log.js
│   ├── npm.js
│   ├── package.js
│   ├── total.js
│   └── user.js
├── sync              // 同步相关目录
│   ├── changes_stream_syncer.js
│   ├── index.js
│   ├── status.js
│   ├── sync_all.js
│   ├── sync_exist.js
│   ├── sync_popular.js
│   └── sync_since.js
├── tools             // 工具目录
│   ├── resync_npm_issue_87.js
│   └── sync_download_total.js
├── view              // 页面文件目录
│   └── web                  // web服务器 对应目录
└── worker.js                    // 服务器启动的真正文件
```
