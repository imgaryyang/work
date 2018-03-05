'use strict'

/**
 * Reflux store of User
 */

import Reflux from 'reflux';

import {
    AsyncStorage,
} from 'react-native';

import UserAction from './UserAction';
import * as Global from '../Global';

let _USER = {
    user: null,
    bankCards: null,
};

let UserStore = Reflux.createStore({

    init: function() {
        this.listenTo(UserAction.onUpdateUser, this.onUpdateUser);
        this.listenTo(UserAction.onUpdateBankCards, this.onUpdateBankCards);
        this.listenTo(UserAction.login, this.login);
        this.listenTo(UserAction.logout, this.logout);
    },

    //用户登录后更新User
    login: async function(user, bankCards) {
        try {
        	_USER = {
	    		user: user,
	    	    bankCards: bankCards,	
            };
        	
            await AsyncStorage.setItem(Global._ASK_USER, JSON.stringify(user));
            await AsyncStorage.setItem(Global._ASK_USER_BANKCARDS, JSON.stringify(bankCards));
            this.trigger(_USER);
        } catch(e) {
            console.log('[error] >>>>>> UserStore.login():');
            console.log(e);
        }
    },

    //当用户信息发生变化时
    onUpdateUser: async function(user) {
        try {
        	if(user !== _USER.user){
        		_USER.user = user;
        		
        		await AsyncStorage.setItem(Global._ASK_USER, JSON.stringify(user));
        		this.trigger(_USER);
        	}
        } catch(e) {
            console.log('[error] >>>>>> UserStore.onUpdateUser():');
            console.log(e);
        }
    },
    //当用户卡信息发生变化时
    onUpdateBankCards: async function(bankCards) {
        try {
        	if(bankCards !== _USER.bankCards){
        		_USER.bankCards = bankCards;
        		
        		await AsyncStorage.setItem(Global._ASK_USER_BANKCARDS, JSON.stringify(bankCards));
        		this.trigger(_USER);
        	}
        } catch(e) {
            console.log('[error] >>>>>> UserStore.onUpdateBankCards():');
            console.log(e);
        }
    },
    
    //用户登出后清空User
    logout: async function() {
        try {
            await AsyncStorage.removeItem(Global._ASK_USER);
            await AsyncStorage.removeItem(Global._ASK_USER_BANKCARDS);
            _USER = {
        		user: null,
    		    bankCards: null,	
            }
            this.trigger(_USER);
        } catch(e) {
            console.log('[error] >>>>>> UserStore.logout():');
            console.log(e);
        }
    },

    //获取用户信息
    getUser: function() {
        return _USER.user;
    },
    getBankCards: function() {
        return _USER.bankCards;
    },
    getSalaryCard: function(){
        let salaryCard = null;
        if(_USER.bankCards == null || _USER.bankCards.length == 0){
            return salaryCard;
        }
        for(let i=0; i<_USER.bankCards.length; i++){
            if(_USER.bankCards[i] && _USER.bankCards[i].cardType && _USER.bankCards[i].cardType.type == "2"){
                salaryCard = _USER.bankCards[i];
                break;
            }
        }
        return salaryCard;
    }
});

module.exports = UserStore;


