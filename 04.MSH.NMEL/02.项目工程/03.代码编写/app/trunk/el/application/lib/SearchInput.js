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

import * as Global	from '../Global';
import Icon			from 'react-native-vector-icons/Ionicons';
import EasyIcon		from 'rn-easy-icon';

class SearchInput extends Component {

    static displayName = 'SearchInput';
    static description = '搜索框组件';

    static propTypes = {

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

    }

    state = {
        value: this.props.value,
    }

    constructor(props) {
        super(props);
        this.onChangeText = this.onChangeText.bind(this);
    }
    /**
    * 组件接收参数变化
    */
    componentWillReceiveProps (props) {
        this.setState(props);
    }

    onChangeText (value) {
    	this.setState({value: value}, () => {
			if(typeof this.props.onChangeText == 'function')
				this.props.onChangeText(this.state.value);
    	})
    }

    render() {
        return (
            <View style = {[this.getStyles().searchInputHolder, this.props.style]}>
                <EasyIcon name = "ios-search-outline" size = {16} color = {Global._colors.IOS_GRAY_FONT} width = {30} height = {30} />
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
    }

    getStyles () {
        return StyleSheet.create({
            searchInputHolder: {
				height: 30,
				borderRadius: 15,
				borderWidth: 1 / Global._pixelRatio,
				borderColor: Global._colors.IOS_NAV_LINE,
				backgroundColor: 'white',
				flex: 1,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
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
    }
}

export default SearchInput;
