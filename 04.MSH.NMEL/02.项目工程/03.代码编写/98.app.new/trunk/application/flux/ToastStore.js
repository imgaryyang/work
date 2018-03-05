'use strict'

/**
 * Reflux store of Toast
 */

import Reflux from 'reflux';

import ToastAction from './ToastAction';

let ToastStore = Reflux.createStore({

    //初始化
    init: function() {

        this.listenTo(ToastAction.show, this.show);

    },

    //显示toast
    show: function(msg) {
        /*console.log(msg);
        console.log(typeof msg);*/
        msg = typeof msg == 'string' ? msg : (typeof msg == 'object' ? JSON.stringify(msg) : msg.toString());
        this.trigger(msg);
    },

});

module.exports = ToastStore;


