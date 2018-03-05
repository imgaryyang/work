'use strict'

/**
 * Reflux store of Auth
 */

import Reflux from 'reflux';

import AuthAction from './AuthAction';

let auth = {
    needLogin: false,
    interceptedRoute: null,
    continuePush: false,
};

let AuthStore = Reflux.createStore({

    //初始化
    init: function() {

        this.listenTo(AuthAction.needLogin,             this.needLogin);
        this.listenTo(AuthAction.clearNeedLogin,        this.clearNeedLogin);
        this.listenTo(AuthAction.clearInterceptedRoute, this.clearInterceptedRoute);
        this.listenTo(AuthAction.continuePush,          this.continuePush);
        this.listenTo(AuthAction.clearContinuePush,     this.clearContinuePush);

    },

    //需要导向登录
    needLogin: function(interceptedRoute) {
        auth.needLogin = true;
        //if(interceptedRoute)
            auth.interceptedRoute = interceptedRoute;
        this.trigger(auth);
    },

    //清空需要登录状态
    clearNeedLogin: function() {
        auth.needLogin = false;
    },

    //得到被阻断的路由
    getInterceptedRoute: function() {
        return auth.interceptedRoute;
    },

    //清空被阻断的场景路由
    clearInterceptedRoute: function() {
        auth.interceptedRoute = null;
    },

    //继续跳转阻断的场景
    continuePush: function() {
        auth.continuePush = true;
        this.trigger(auth);
    },

    //清除继续跳转状态
    clearContinuePush: function() {
        auth.continuePush = false;
    },

});

module.exports = AuthStore;


