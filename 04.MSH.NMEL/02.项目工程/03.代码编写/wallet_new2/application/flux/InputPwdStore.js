'use strict'

/**
 * Reflux store of Toast
 */

import Reflux from 'reflux';

import InputPwdAction from './InputPwdAction';

let InputPwdStore = Reflux.createStore({

    //初始化
    init: function() {
        this.listenTo(InputPwdAction.inputPwd, this.inputPwd);
        this.listenTo(InputPwdAction.hidePwd, this.hidePwd);
    },

    //显示pwd
    inputPwd: function(callback) {
    	this.show = true;
        this.trigger(this.show, callback);
    },

    getShowState: function() {
    	return this.show;
    } ,

    hidePwd: function( ) {
    	this.show = false;
    	this.trigger(this.show, null);
    } ,
});

module.exports = InputPwdStore;


