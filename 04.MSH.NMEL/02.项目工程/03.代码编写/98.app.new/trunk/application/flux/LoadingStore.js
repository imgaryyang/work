'use strict'

/**
 * Reflux store of Loading
 */

import Reflux from 'reflux';

import LoadingAction from './LoadingAction';

let LoadingStore = Reflux.createStore({

    //初始化
    init: function() {

        this.listenTo(LoadingAction.show, this.show);

    },

    //显示Loading
    show: function(visibility) {
        this.trigger(visibility);
    },

});

module.exports = LoadingStore;


