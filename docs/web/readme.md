# 易鑫前端NPM仓库

## 统计概况

<div class="ant-table">
<table class="downloads">
  <tbody>
    <tr>
      <td class="count" id="total-packages"></td><td>total packages</td>
      <td class="count" id="total-versions"></td><td>total package versions</td>
      <td class="count" id="total-deletes"></td><td>total delete packages</td>
    </tr>
    <tr>
      <td class="count"></td><td> downloads today</td>
      <td class="count"></td><td> downloads in this week</td>
      <td class="count"></td><td> downloads in this month</td>
    </tr>
    <tr>
      <td class="count"></td><td> downloads in the last day</td>
      <td class="count"></td><td> downloads in the last week</td>
      <td class="count"></td><td> downloads in the last month</td>
    </tr>
  </tbody>
</table>
</div>

<div class="sync" style="display:none;">
  <h3>同步npm源的情况</h3>
  <p id="sync-model"></p>
  <p>Last sync time is <span id="last-sync-time"></span>. </p>
  <div class="ant-alert ant-alert-info syncing">
    <span class="anticon ant-alert-icon anticon-info-circle"></span>
    <span class="ant-alert-description">The sync worker is working in the backend now. </span>
  </div>
  <div class="ant-table">
  <table class="sync-status">
    <tbody>
      <tr>
        <td><span id="need-sync"></span> packages need to be sync</td>
        <td class="syncing"><span id="left-sync"></span> packages and dependencies waiting for sync</td>
        <td><span id="percent-sync"></span>% progress</td>
      </tr>
      <tr>
        <td><span id="success-sync"></span> packages and dependencies sync successed</td>
        <td><span id="fail-sync"></span> packages and dependencies sync failed</td>
        <td>last success: <span id="last-success-name"></span></td>
      </tr>
    </tbody>
  </table>
  </div>
</div>

<script src="/js/readme.js"></script>

### 和npm或淘宝源同步

Only `cnpm` cli has this command. Meaning sync package from source npm.

```bash
$ cnpm sync connect
```

## 如何使用
一般我们通过浏览器去查看整个私有仓库的总体状况和搜索私有库的使用，通过终端去去下
载安装，区别主要是端口号不同。

### 浏览访问
- 直接打开 http://192.168.155.25:7002/  访问即可

### 发布包
- 先全局安装cnpm: npm install -g cnpm --registry=https://registry.npm.taobao.org
- 然后设置全局cnpm的registry：cnpm set registry http://192.168.155.25:7001
- 然后登陆：cnpm login 分别输入用户名、密码和邮箱（第一次输入的密码即为初始密码>）
- 进入你要发布包的目录如test：cd test
- 然后输入： cnpm init 生成一个package.json文件，主要项目名必须为加 @yx/ 前缀，>如：@yx/test
- 然后执行：cnpm publish, 成功后在浏览器端就能看到

### 下载安装包
- 设置cnpm的registry：cnpm set registry http://192.168.155.25:7001
- 或 install 时加上 --registry=http://192.168.155.25:7001
- 然后cnpm install 包名，如：cnpm install @yxin/test
- 然后在项目目录的node_modules下就会有@yx目录，所有的私有包都在里面
- 也可以在项目的package.json文件添加依赖，如："@yx/test": "1.0.0", 后直接cnpm install

## 之后任务
   把项目用到的开源包逐渐发布到私有源进行独立维护。
