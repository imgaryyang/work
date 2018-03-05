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

import Icon     from '../EasyIcon';
import Button   from '../EasyButton';

class EasyTextInput extends Component {

    static displayName = '_EasyTextInput_';
    static description = '输入域组件';

    _textInput          = null;

    _labelConfig        = {};
    _textInputConfig    = {};
    _helpConfig         = {};
    _errorConfig        = {};
    _containerStyle     = {};
    _inputContainerStyle = {};
    _inputHeight        = 35;

    static propTypes = {

        /**
         * 配置文件
         */
        config: PropTypes.object,

        /**
         * 输入域名称
         */
        name: PropTypes.string.isRequired,

        /**
         * 输入域初始值
         */
        value: PropTypes.string,

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

    };

    static defaultProps = {
        iconLib: 'Ionicons',
        showClearIcon: true,
        dataType: 'string',
    };

	state = {
        value: this.props.value,
        sci: this.props.value ? true : false,
	};

    constructor (props) {
        super(props);
        /*console.log(this.props.config);*/

        this._labelConfig       = this.props.config.fields.label;
        this._textInputConfig   = this.props.config.fields.textInput;
        this._helpConfig        = this.props.config.help;
        this._errorConfig       = this.props.config.error;
        this._containerStyle    = this.props.config.fields.style;
        this._inputContainerStyle = this.props.config.fields.textInput.style;
        this._inputHeight       = this._inputContainerStyle.height ? this._inputContainerStyle.height : 35;
        this._inputInnerHeight  = Platform.OS == 'android' ? this._inputHeight - (2 / PixelRatio.get()) : this._inputHeight;

        this.validate           = this.validate.bind(this);
        this.showError          = this.showError.bind(this);
        this.onChangeText       = this.onChangeText.bind(this);
        this._getLabel          = this._getLabel.bind(this);
        this._getIcon           = this._getIcon.bind(this);
        this._getClearIcon      = this._getClearIcon.bind(this);
        this._clear             = this._clear.bind(this);
        this._getTextInput      = this._getTextInput.bind(this);
        this._getHelp           = this._getHelp.bind(this);
        this._getError          = this._getError.bind(this);
        this._getAdjustButton   = this._getAdjustButton.bind(this);
        this._adjust            = this._adjust.bind(this);
        this._getPropsByDataType = this._getPropsByDataType.bind(this);
    }

    componentDidMount () {
        //register real TextInput event
        this.focus              = this._textInput.focus;
        this.blur               = this._textInput.blur;
        this.clear              = this._textInput.clear;
    }

    componentWillReceiveProps (props) {
        if(props['value'])
            this.setState({value: props['value']});
        else
            this.setState({value: null});
    }

    /**
     * 输入域校验
     */
    validate () {
        //console.log('in validate.');
        if (this.props.required && !this.state.value) { //判断非空
            this.setState({error: this.props.label + '必须填写！'});
            return false;
        }
        if (this.props.minLength) { //判断最小长度
            let value = this.state.value ? this.state.value : '';
            if(value.length < this.props.minLength) {
                this.setState({error: this.props.label + '长度至少为 ' + this.props.minLength + ' ！'});
                return false;
            }
        }
        if (typeof this._textInputConfig.dataType[this.props.dataType].validate == 'function') {
            if (!this._textInputConfig.dataType[this.props.dataType].validate(this.state.value)) {
                this.setState({error: this.props.label + '不符合要求！'});
                return false;
            }
        }
        this.setState({error: ''});
        return true;
    }

    /**
     * 显示错误信息
     */
    showError (error) {
        this.setState({error: error});
    }

    /**
     * onChangeText event
     */
    onChangeText (value) {
        let sci;
        if(value)
            sci = true;
        else
            sci = false;
        this.setState({
            //value: value,
            sci: sci,
        }, () => {
            if(typeof this.props.onChange == 'function')
                this.props.onChange(this.props.name, value + '');
        });
    }

    /**
     * get label
     */
    _getLabel () {
        //console.log(this._labelConfig);
        if(!this._labelConfig.showLabel)
            return null;

        let {width, height, backgroundColor, ...other} = this._labelConfig.style;

        let widthStyle = this._labelConfig.position == 'left' ? {width: this._labelConfig.width} : (width ? {width: width} : null);
        let heightStyle = this._labelConfig.position == 'left' ? {height: this._inputInnerHeight} : (height ? {height: height} : null);
        let bgStyle = backgroundColor ? {backgroundColor: backgroundColor} : null;

        let labelStyle = this._labelConfig.position == 'left' ? {
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
     * 清除输入框内容
     */
    _clear () {
        if(this._textInput) {
            this._textInput.clear();
            this.setState({sci: false});
            if(typeof this.props.onChange == 'function')
                this.props.onChange(this.props.name, '');
        }
    }

    /**
     * get clear icon for android
     */
    _getClearIcon () {
        let clearIcon = Platform.OS == 'android' && this.props.showClearIcon && this.state.sci ? 
            (
                <TouchableOpacity onPress = {this._clear} >
                    <Icon 
                        iconLib = "Ionicons" 
                        name    = "ios-close" 
                        size    = {this._textInputConfig.icon.size} 
                        color   = {this._textInputConfig.icon.color} 
                        width   = {this._textInputConfig.icon.width} 
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

        let button = this.props.buttonText ? (
            <TouchableOpacity 
                onPress = {() => {if (typeof this.props.buttonOnPress == "function") this.props.buttonOnPress();}} 
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
                ]} >{this.props.buttonText}</Text>
            </TouchableOpacity>
        ) : null;

        return button;
    }

    _adjust (type) {
        try {
            let v = this.state.value ? parseInt(this.state.value) : 0;

            if(type == 'plus') v += 1;
            else if(type == 'minus') v -= 1;

            this.setState({value: v + ''}, () => {
                if(typeof this.props.onChange == 'function')
                    this.props.onChange(this.props.name, v + '');
            });
        } catch(e) {}
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
                <TouchableOpacity onPress = {() => this._adjust(type)} style = {[styles.adjustButton, {height: this._inputInnerHeight}]} >
                    {icon}
                </TouchableOpacity>
            </View>
        ) : null;

        return abs;
    }

    /**
     * 根据数据类型取对应的输入框参数
     */
    _getPropsByDataType () {
        return this._textInputConfig.dataType[this.props.dataType].props;
    }

    /**
     * get TextInput
     * @param  {[object]} fontSize   [style - fontSize]
     * @param  {[object]} color      [style - color]
     * @param  {[object]} fontWeight [style - fontWeight]
     * @param  {[object]} lineHeight [style - lineHeight]
     * @param  {[object]} textAlign  [style - textAlign]
     * @return {[node]}              []
     */
    _getTextInput (_fontSize, _color, _fontWeight, _lineHeight, _textAlign) {
        _fontSize    = _fontSize ? {fontSize: _fontSize} : null;
        _color       = _color ? {color: _color} : null;
        _fontWeight  = _fontWeight ? {fontWeight: _fontWeight} : null;
        _lineHeight  = _lineHeight ? {lineHeight: _lineHeight} : null;
        _textAlign   = this.props.textAlign ? {textAlign: this.props.textAlign} : (_textAlign ? {textAlign: _textAlign} : null);

        let {config, name, value, dataType, label, help, error, 
            iconLib, icon, showClearIcon, textAlign, buttonText, buttonOnPress, 
            showAdjustButton, leftComponent, rightComponent, onChange, 
            registerChild, required, minLength, style, ...otherBaseProps} = this.props;

        let {...otherProps} = this._getPropsByDataType();
        //console.log({...otherProps})

        return (
            <TextInput 
                ref = {(c) => {
                    this._textInput = c;
                    this.props.registerChild(this.props.name, c, '2');
                }} 
                value = {this.state.value} 
                onChangeText = {this.onChangeText} 
                style = {[styles.textInput, _fontSize, _color, _fontWeight, _lineHeight, _textAlign]} 
                clearButtonMode = {Platform.OS == 'ios' && this.props.showClearIcon ? 'always' : 'never'} 
                underlineColorAndroid = "transparent" 
                {...otherBaseProps} 
                {...otherProps} 
            />
        );

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
        if (!this.state.error && !this.props.error)
            return null
        let errMsg = this.props.error ? this.props.error : (this.state.error ? this.state.error : null);
        return (
            <Text style = {[styles.helpNError, styles.error, this._errorConfig.style]} >{errMsg}</Text>
        );
    }

    /**
     * 渲染主场景
     */
	render () {

        let {fontSize, color, fontWeight, lineHeight, textAlign, ...other} = this._inputContainerStyle;

        let topLabel    = this._labelConfig.position == 'top' ? this._getLabel() : null;
        let leftLabel   = this._labelConfig.position == 'left' ? this._getLabel() : null;

        let leftIcon    = this._textInputConfig.icon.position == 'left' ? this._getIcon() : null;
        let rightIcon   = this._textInputConfig.icon.position == 'right' ? this._getIcon() : null;

        if(this.props.leftComponent || this.props.rightComponent) {
            return (
                <View 
                    ref = {(c) => {
                        this.props.registerChild(this.props.name, this, '1');
                    }} 
                    style = {[styles.container, this._containerStyle]} >
                    {topLabel}
                    <View style = {[styles.inputContainer, {...other}]} >
                        {this.props.leftComponent}
                        {this._getTextInput(fontSize, color, fontWeight, lineHeight, textAlign)}
                        {this.props.rightComponent}
                    </View>
                </View>
            );
        }

		return (
			<View 
                ref = {(c) => {
                    this.props.registerChild(this.props.name, this, '1');
                }} 
                style = {[styles.container, this._containerStyle]} >
                {topLabel}
                <View style = {[styles.inputContainer, {...other}]} >
                    {leftIcon}
                    {leftLabel}
                    {this._getAdjustButton('minus')}
                    {this._getTextInput(fontSize, color, fontWeight, lineHeight, textAlign)}
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
    textInput: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 0,
    },
    helpNError: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 8,
        paddingBottom: 2,
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

export default EasyTextInput;

