'use strict'

/**
 * Reflux store of User
 */

import Reflux from 'reflux';

import {
    AsyncStorage,
} from 'react-native';

import ShopAction from './ShopAction';
import * as Global from '../Global';

let ShoppingCart = {
    num: 0,
};

let ShopStore = Reflux.createStore({

    init: function() {
        this.listenTo(ShopAction.onShoppingCartNumAdd, this.onShoppingCartNumAdd);
        this.listenTo(ShopAction.onShoppingCartNumReset, this.onShoppingCartNumReset);
    },

    // 增加购物车数量
    onShoppingCartNumAdd: function(num) {
    	ShoppingCart.num += Number(num);
    	this.trigger(ShoppingCart.num);
    },
    
    // 重置购物车数量
    onShoppingCartNumReset: function(num) {
    	if(ShoppingCart.num == Number(num))
    		return false;
    	ShoppingCart.num = Number(num);
    	this.trigger(ShoppingCart.num);
    },
    
    // 获取购物车数量
    getShoppingCartNum: function() {
    	return ShoppingCart.num;
    }
});

module.exports = ShopStore;


