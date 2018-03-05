'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
} from 'react-native';

var Global  = require('../Global');
var Icon    = require('react-native-vector-icons/Ionicons');

var SearchInput = React.createClass({

    statics: {
        title: 'SearchInput',
        description: '搜索框组件',
    },

    propTypes: {

        /**
        * 初始值
        */
        value: PropTypes.string,

        /**
         * onChangeText回调函数
         */
        onChangeText: PropTypes.func,

        /**
         * 样式
         */
        style: PropTypes.object,

    },

    getInitialState() {
        return {
        	value: this.props.value,
        };
    },

    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps: function(props) {
        this.setState(props);
    },

    onChangeText: function(value) {
    	this.setState({value: value}, () => {
			if(typeof this.props.onChangeText == 'function')
				this.props.onChangeText(this.state.value);
    	})
    },

    render() {
        return (
            <View style = {[this.getStyles().searchInputHolder, this.props.style]}>
                <TextInput 
                	style = {[this.getStyles().searchInput]} 
                	placeholder = '请输入查询条件' 
                	value = {this.state.value} 
                	onChangeText = {this.onChangeText} />
                <TouchableOpacity style = {[Global._styles.CENTER, {width: 30}]} onPress = {() => {
                	this.onChangeText(null);
                }} >
                	<Icon 
                		name = 'ios-close' 
                		size = {16} 
                		color = {Global._colors.IOS_GRAY_FONT} 
                		style = {[Global._styles.ICON, this.getStyles().clearIcon]} 
                	/>
                </TouchableOpacity>
            </View>
        );
    },

    getStyles() {
        return StyleSheet.create({
            searchInputHolder: {
				height: 30,
				borderRadius: 5,
				borderWidth: 1 / Global._pixelRatio,
				borderColor: Global._colors.IOS_NAV_LINE,
				backgroundColor: 'white',
				flex: 1,
				flexDirection: 'row',
            },
            searchInput: {
            	flex: 1,
				borderWidth: 0,
				backgroundColor: 'transparent',
				fontSize: 13,
				paddingLeft: 5,
				paddingRight: 5,
				paddingTop: 0,
				paddingBottom: 0,
				height: 30,
            },
            clearIcon: {
            },
        });
    },
});

module.exports = SearchInput;
