var Reflux = require('reflux');
var UserAction = require('../actions/UserAction');
var Global = require('../../Global');

var UserInfo = null;

import React, {
  AsyncStorage,
}
from 'react-native';

var UserStore = Reflux.createStore({

  init: function() {
    // Here we listen to actions and register callbacks
    this.listenTo(UserAction.updateUser, this.onUpdate);
    this.listenTo(UserAction.login, this.login);
    this.listenTo(UserAction.logout, this.logout);
  },

  login: async function(userInfo) {
    console.log('login---------------------------');
    Global.USER_LOGIN_INFO = userInfo;
    UserInfo = userInfo;
    await AsyncStorage.setItem(Global.ASK_USER, JSON.stringify(userInfo));
    this.trigger(UserInfo);
  },
  //当用户信息发生变化时
  onUpdate: async function(userInfo) {
    let user = await AsyncStorage.getItem(Global.ASK_USER);
    var user_info = JSON.parse(user);
    for (var key in userInfo) {
      user_info[key] = userInfo[key];
    }
    UserInfo = user_info;
    Global.USER_LOGIN_INFO = user_info;
    await AsyncStorage.setItem(Global.ASK_USER, JSON.stringify(user_info));
    this.trigger(UserInfo);
  },

  logout: async function() {
    console.log('logout--------------------------------');
    await AsyncStorage.removeItem(Global.ASK_USER);
    Global.USER_LOGIN_INFO = null;
    UserInfo = null;
    this.trigger(UserInfo);
  },


  getUserInfo: async function() {
    console.log('userInfo-----------------------------');
    let userInAS = await AsyncStorage.getItem(Global.ASK_USER);
    UserInfo = JSON.parse(userInAS);
    Global.USER_LOGIN_INFO = UserInfo;
    return UserInfo;
  }
});
module.exports = UserStore; //Finally, export the Store