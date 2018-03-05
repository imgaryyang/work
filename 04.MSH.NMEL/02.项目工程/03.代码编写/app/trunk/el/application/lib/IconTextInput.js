'use strict';
/**
 * 带图标的输入框
 */
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

import * as Global  from '../Global';
import Icon         from 'react-native-vector-icons/Ionicons';

class IconTextInput extends Component {

	_textInput = null;

    static displayName = 'IconTextInput';
    static description = '带图标的IconTextInput';

    static propTypes = {
    	/**
    	 * 显示在左侧的Icon
    	 */
    	leftIcons: PropTypes.array,

    	/**
    	 * 显示在右侧的Icon
    	 */
    	rightIcons: PropTypes.array,

    	/**
    	 * 是否显示清除输入内容的Icon
    	 */
    	showClearIcon: PropTypes.bool,

    	/**
    	 * 清除ICON的大小
    	 */
    	clearIconSize: PropTypes.number,

    	/**
    	 * 清除ICON的颜色
    	 */
    	clearIconColor: PropTypes.string,
    };

    static defaultProps = {
    	leftIcons: [],
    	rightIcons: [],
    	showClearIcon: false,
    	clearIconSize: 20,
    	clearIconColor: Global._colors.IOS_LIGHT_GRAY,
    };

	state = {
		cntnHeight: 0,
        value: this.props.value,
        sci: this.props.value ? true : false,
	};

    constructor (props) {
        super(props);

        this.getLeftIcons 	= this.getLeftIcons.bind(this);
        this.getRightIcons 	= this.getRightIcons.bind(this);
        this.onLayout 		= this.onLayout.bind(this);
        this.getIcon 		= this.getIcon.bind(this);
        this.clear          = this.clear.bind(this);
        this.focus          = this.focus.bind(this);
        this.blur           = this.blur.bind(this);
        this.onChangeText 	= this.onChangeText.bind(this);
    }

    componentDidMount () {
    	/*console.log(this.props.style);
    	let s = {};*/
    }

    /**
     * 获取输入域容器的高度
     */
    onLayout (e) {
    	this.setState({
    		cntnHeight: e.nativeEvent.layout.height,
    	});
    }

    focus () {
        this._textInput.focus();
    }

    blur () {
        this._textInput.blur();
    }

    onChangeText (value) {
        let sci;
        if(value)
            sci = true;
        else
            sci = false;
        this.setState({
            value: value,
            sci: sci,
        }, () => {
            if(typeof this.props.onChangeText == 'function')
                this.props.onChangeText(value);
        });
    }

    /**
     * 根据icon配置文件生成icon
     */
    getIcon (icon) {
    	return React.createElement(
    		icon.component, 
    		{
    			name: icon.name, 
    			size: icon.size ? icon.size : 20, 
    			color: icon.color ? icon.color : Global._colors.IOS_DARK_GRAY,
    			style: {
    				marginLeft: 5,
    			   	marginRight: 5,
    			   	textAlign: 'center',
    			   	width: icon.size ? icon.size : 20, 
    			},
    		}
    	);
    }

    /**
     * 获取所有左侧ICON
     */
	getLeftIcons () {
		let icons = this.props.leftIcons.map((icon, idx) => {
			return (<View key = {"l_i_" + idx} >{this.getIcon(icon)}</View>);
		});
		return (
			<View style = {[Global._styles.CENTER, styles.iconHolder, styles.leftIconHolder, {height: this.state.cntnHeight}]} >
				{icons}
			</View>
		);
	}

	/**
	 * 获取所有右侧ICON
	 */
	getRightIcons () {
		let icons = this.props.rightIcons.map((icon, idx) => {
			return (<View key = {"r_i_" + idx}>{this.getIcon(icon)}</View>);
		});
		let clearIcon = Global._os == 'android' && this.props.showClearIcon && this.state.sci ? 
			(
				<TouchableOpacity onPress = {this.clear} >
					<Icon name = "ios-close-circle-outline" 
						size = {this.props.clearIconSize} 
						color = {this.props.clearIconColor} 
						style = {[Global._styles.ICON, {marginLeft: 5, marginRight: 5}]} />
				</TouchableOpacity>
			) 
			: null;
		return (
			<View style = {[Global._styles.CENTER, styles.iconHolder, styles.rightIconHolder, {height: this.state.cntnHeight}]} >
				{clearIcon}
				{icons}
			</View>
		);
	}

	/**
	 * 清除输入框内容
	 */
	clear () {
		if(this._textInput) {
			this._textInput.clear();
			if(this._textInput.props.onChangeText)
				this._textInput.props.onChangeText.call('');
		}
	}

	render () {
		
		let textInput = (
            <TextInput 
                ref = {(c) => this._textInput = c} 
                {...this.props} 
                value = {this.state.value} 
                onChangeText = {this.onChangeText} 
                clearButtonMode = {Global._os == 'ios' && this.props.showClearIcon ? 'while-editing' : 'never'}
            />
        );

		return (
			<View style = {{position: 'relative'}} onLayout = {this.onLayout} >
				
				{textInput}
				{this.getLeftIcons()}
				{this.getRightIcons()}

			</View>
		);
	}

}

const styles = StyleSheet.create({
	iconHolder: {
		position: 'absolute',
		top: 0,
		backgroundColor: 'transparent',
		flexDirection: 'row',
	},
	leftIconHolder: {
		left: 0,
	},
	rightIconHolder: {
		right: 0,
	},
});

export default IconTextInput;



