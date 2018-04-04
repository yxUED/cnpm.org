"use strict";
// 仅支持默认的用户账号体系，如果使用公司自有账号体系，忽略本文件
// 使用 node ./bin/change_password.js 'username' 'new_password' 修改密码

var UserModel = require('../models').User;
// 优雅处理回调函数的库
var co = require('co');
// 一堆有用的node工具库，加解密等
var utility = require('utility');

var username = process.argv[2];
var newPassword = process.argv[3];

co(function * () {
  var user = yield UserModel.find({where: {name: username}});
  var salt = user.salt;
  console.log(`user original password_sha: ${user.password_sha}`);
  var newPasswordSha = utility.sha1(newPassword + salt);
  user.password_sha = newPasswordSha;
  user = yield user.save();
  console.log(`change user password successful!! user new password_sha: ${user.password_sha}`);
  process.exit(0);
}).catch(function (e) {
  console.log(e);
});
