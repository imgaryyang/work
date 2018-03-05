'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    PixelRatio,
} from 'react-native';

import Icon     from 'rn-easy-icon';
import Button   from 'rn-easy-button';

class EasyFieldFrame extends Component {

    static displayName = '_EasyFieldFrame_';
    static description = '输入域组件';

    static propTypes = {

        /**
         * 配置文件
         */
        config: PropTypes.object,

        /**
         * 输入域数据类型
         * string | number | mobile | email | bankAcct | amt | cnIdNo
         */
        dataType: PropTypes.string,

        /**
         * 输入域标签
         */
    	label: PropTypes.string,

        /**
         * 输入域提示信息
         */
    	help: PropTypes.string,

        /**
         * 输入域错误校验信息
         */
    	error: PropTypes.string,

        /**
         * 显示图标时使用的图标库
         */
        iconLib: PropTypes.string,

        /**
         * 显示的图标
         */
        icon: PropTypes.string,

    	/**
    	 * 是否显示清除输入内容的Icon
    	 */
    	showClearIcon: PropTypes.bool,

        /**
         * 输入框文字对齐方式，如果传入此参数将覆盖config中的配置
         */
        textAlign: PropTypes.string,

        /**
         * 扩展button的text
         */
        buttonText: PropTypes.string,

        /**
         * 扩展button的点击事件
         */
        buttonOnPress: PropTypes.func,

        /**
         * button text when disabled
         */
        buttonDisabledText: PropTypes.string,

        /**
         * disable button
         */
        buttonDisabled: PropTypes.bool,

        /**
         * 显示数字输入域的调整按钮
         */
        showAdjustButton: PropTypes.bool,

        /**
         * psycho mode
         * 传入后显示在TextInput左侧，不显示label和icon
         */
        leftComponent: PropTypes.node,

        /**
         * psycho mode
         * 传入后显示在TextInput右侧，不显示label和icon
         */
        rightComponent: PropTypes.node,

        /**
         * onChange function of form
         */
        onChange: PropTypes.func,

        /**
         * registerChild function of form
         */
        registerChild: PropTypes.func,

        /**
         * required
         */
        required: PropTypes.bool,

        /**
         * minLength
         */
        minLength: PropTypes.number,

        /**
         * field component
         */
        _realFieldComponent: PropTypes.node.isRequired,

        /**
         * function of clear button
         */
        _clear: PropTypes.func,

        /**
         * function of adjust button
         */
        _adjust: PropTypes.func,

        /**
         * field value
         */
        _value: PropTypes.string,

        /**
         * error message of field
         */
        _error: PropTypes.string,

        /**
         * field type name
         */
        _fieldType: PropTypes.string.isRequired,

    };

    static defaultProps = {
        iconLib:        'Ionicons',
        showClearIcon:  true,
        dataType:       'string',
        buttonDisabled: false,
    };

	state = {
	};

    constructor (props) {
        super(props);
        //configs
        this._labelConfig           = this.props.config.fields.label;
        this._textInputConfig       = this.props.config.fields.textInput;
        this._helpConfig            = this.props.config.help;
        this._errorConfig           = this.props.config.error;
        this._containerStyle        = this.props.config.fields.style;
        this._fieldContainerStyle   = this.props.config.fields[this.props._fieldType].style;
        this._inputHeight           = this._fieldContainerStyle.height ? this._fieldContainerStyle.height : 35;
        this._inputInnerHeight      = Platform.OS == 'android' ? this._inputHeight - (2 / PixelRatio.get()) : this._inputHeight;
        //methods
        this._getLabel              = this._getLabel.bind(this);
        this._getIcon               = this._getIcon.bind(this);
        this._getClearIcon          = this._getClearIcon.bind(this);
        this._getHelp               = this._getHelp.bind(this);
        this._getError              = this._getError.bind(this);
        this._getAdjustButton       = this._getAdjustButton.bind(this);
    }

    componentDidMount () {
    }

    componentWillReceiveProps (props) {
    }

    /**
     * get label
     */
    _getLabel () {
        //console.log(this._labelConfig);
        
        let showLabel = this._labelConfig.showLabel;
        showLabel = typeof this.props.showLabel == 'boolean' ? this.props.showLabel : showLabel;

        let position = this._labelConfig.position;
        position = typeof this.props.labelPosition == 'string' ? this.props.labelPosition : position;

        if(!showLabel)
            return null;

        let {width, height, backgroundColor, ...other} = this._labelConfig.style;

        let widthStyle = position == 'left' ? {width: this._labelConfig.width} : (width ? {width: width} : null);
        let heightStyle = position == 'left' ? {height: this._inputInnerHeight} : (height ? {height: height} : null);
        let bgStyle = backgroundColor ? {backgroundColor: backgroundColor} : null;

        let labelStyle = position == 'left' ? {
            alignItems: 'center',
            justifyContent: 'center',
        } : {
            alignItems: 'flex-start',
            justifyContent: 'center',
        };

        return (
            <View style = {[widthStyle, heightStyle, bgStyle, labelStyle, {overflow: 'hidden'}]} >
                <Text style = {[widthStyle, {...other}]} >{this.props.label}</Text>
            </View>
        );
    }

    /**
     * get icon
     */
    _getIcon () {
        //console.log(this._textInputConfig.icon.style);
        if(this.props.icon) {
            return <Icon 
                iconLib = {this.props.iconLib} 
                name    = {this.props.icon} 
                size    = {this._textInputConfig.icon.size} 
                color   = {this._textInputConfig.icon.color} 
                width   = {this._textInputConfig.icon.width} 
                height  = {this._inputInnerHeight} 
                bgColor = {this._textInputConfig.icon.bgColor} 
                style   = {[this._textInputConfig.icon.style]} 
            />
        } else 
            return null;
    }

    /**
     * get clear icon for android
     */
    _getClearIcon () {
        let clearIcon = Platform.OS == 'android' && this.props.showClearIcon && this.props._value ? 
            (
                <TouchableOpacity onPress = {() => this.props._clear()} >
                    <Icon 
                        iconLib = "Ionicons" 
                        name    = "ios-close" 
                        size    = {17} 
                        color   = 'rgba(214,214,214,1)' 
                        width   = {27} 
                        height  = {this._inputHeight} 
                    />
                </TouchableOpacity>
            ) 
            : null;
        return clearIcon;
    }

    /**
     * 取输入框右侧扩展按钮
     */
    _getButton () {

        let fontSize    = this._textInputConfig.button.fontSize ? {fontSize:        this._textInputConfig.button.fontSize} : null;
        let color       = this._textInputConfig.button.color    ? {color:           this._textInputConfig.button.color} : null;
        let width       = this._textInputConfig.button.width    ? {width:           this._textInputConfig.button.width} : null;
        let bgColor     = this._textInputConfig.button.bgColor  ? {backgroundColor: this._textInputConfig.button.bgColor} : null;

        color           = this.props.buttonDisabled             ? {color:           'rgba(130,130,130,1)'} : color;
        //bgColor         = this.props.buttonDisabled             ? {backgroundColor: 'transparent'} : bgColor;

        let text = this.props.buttonDisabled && this.props.buttonDisabledText ? this.props.buttonDisabledText : this.props.buttonText;

        let button = this.props.buttonText ? (
            <TouchableOpacity 
                onPress = {() => {if (!this.props.buttonDisabled && typeof this.props.buttonOnPress == "function") this.props.buttonOnPress();}} 
                style = {[
                    styles.appendButton, 
                    bgColor,
                    this._textInputConfig.button.style, 
                    width,
                    {height: this._inputInnerHeight}
                ]} 
            >
                <Text style = {[
                    fontSize,
                    color,
                    {textAlign: 'center'}
                ]} >{text}</Text>
            </TouchableOpacity>
        ) : null;

        return button;
    }

    /**
     * 取数字输入域显示的调整按钮
     */
    _getAdjustButton (type) {

        let color       = this._textInputConfig.adjustButton.color    ? {color:           this._textInputConfig.adjustButton.color} : null;
        let bgColor     = this._textInputConfig.adjustButton.bgColor  ? {backgroundColor: this._textInputConfig.adjustButton.bgColor} : null;

        let icon = type == 'plus' ? 
            (<Icon name = "md-add" size = {18} color = {this._textInputConfig.adjustButton.color} />) : 
            (<Icon name = "md-remove" size = {18} color = {this._textInputConfig.adjustButton.color} />);

        let abs = this.props.showAdjustButton ? (
            <View 
                style = {[
                    styles.adjustButtonContainer, 
                    bgColor,
                    {
                        flexDirection: 'row',
                        width: 35,
                        height: this._inputInnerHeight,
                    }
                ]} >
                <TouchableOpacity onPress = {() => this.props._adjust(type)} style = {[styles.adjustButton, {height: this._inputInnerHeight}]} >
                    {icon}
                </TouchableOpacity>
            </View>
        ) : null;

        return abs;
    }

    /**
     * 取help信息
     */
    _getHelp () {
        if (!this.props.help)
            return null
        return (
            <Text style = {[styles.helpNError, styles.help, this._helpConfig.style]} >{this.props.help}</Text>
        );
    }

    /**
     * 取校验错误信息
     */
    _getError () {
        if (!this.props._error)
            return null;

        let errMsg = this.props._error;
        return (
            <Text style = {[styles.helpNError, styles.error, this._errorConfig.style]} >{errMsg}</Text>
        );
    }

    /**
     * 渲染主场景
     */
	render () {

        let {fontSize, color, fontWeight, lineHeight, textAlign, ...other} = this._fieldContainerStyle;

        let position = this._labelConfig.position;
        position = typeof this.props.labelPosition == 'string' ? this.props.labelPosition : position;

        let topLabel    = position == 'top' ? this._getLabel() : null;
        let leftLabel   = position == 'left' ? this._getLabel() : null;

        let leftIcon    = this._textInputConfig.icon.position == 'left' ? this._getIcon() : null;
        let rightIcon   = this._textInputConfig.icon.position == 'right' ? this._getIcon() : null;

        if(this.props.leftComponent || this.props.rightComponent) {
            return (
                <View 
                    style = {[styles.container, this._containerStyle]} >
                    {topLabel}
                    <View style = {[styles.inputContainer, {...other}]} >
                        {this.props.leftComponent}
                        {this.props._realFieldComponent}
                        {this.props.rightComponent}
                    </View>
                </View>
            );
        }

		return (
			<View 
                style = {[styles.container, this._containerStyle]} >
                {topLabel}
                <View style = {[styles.inputContainer, {...other}]} >
                    {leftIcon}
                    {leftLabel}
                    {this._getAdjustButton('minus')}
                    {this.props._realFieldComponent}
                    {this._getClearIcon()}
                    {this._getAdjustButton('plus')}
                    {this._getButton()}
                    {rightIcon}
                </View>
                {this._getError()}
                {this._getHelp()}
			</View>
		);
	}

}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
    },
    helpNError: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 8,
        marginBottom: 2,
    },
    help: {
        color: 'rgba(130,130,130,1)',   //'#828282',
        fontSize: 12,
    },
    error: {
        color: 'rgba(255,59,48,1)',     //'#FF3B30',
        fontSize: 13,
        fontWeight: '500',
    },
    appendButton: {
        alignItems: 'center', 
        justifyContent: 'center',
    },
    adjustButtonContainer: {
        alignItems: 'center', 
        justifyContent: 'center',
    },
    adjustButton: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
    },
});

export default EasyFieldFrame;

