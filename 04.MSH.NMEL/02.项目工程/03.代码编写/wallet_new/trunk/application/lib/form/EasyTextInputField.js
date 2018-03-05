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

import EasyFieldFrame   from './EasyFieldFrame';

class EasyTextInputField extends Component {

    static displayName = '_EasyTextInputField_';
    static description = '输入域组件';

    _textInput          = null;

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

    };

    static defaultProps = {
        iconLib: 'Ionicons',
        showClearIcon: true,
        dataType: 'string',
    };

	state = {
        value: this.props.value,
	};

    constructor (props) {
        super(props);
        //configs
        this._textInputConfig   = this.props.config.fields.textInput;
        this._inputContainerStyle = this.props.config.fields.textInput.style;
        //methods
        this.validate           = this.validate.bind(this);
        this.showError          = this.showError.bind(this);
        this.onChangeText       = this.onChangeText.bind(this);
        this._clear             = this._clear.bind(this);
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
        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.props.name, value + '');
    }

    /**
     * 清除输入框内容
     */
    _clear () {
        /*if(this._textInput) {
            this._textInput.clear();
        }*/
        this.setState({
            value: '',
            text: '',
        });
        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.props.name, '');
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
        
        _fontSize    = _fontSize            ? {fontSize: _fontSize} : null;
        _color       = _color               ? {color: _color} : null;
        _fontWeight  = _fontWeight          ? {fontWeight: _fontWeight} : null;
        _lineHeight  = _lineHeight          ? {lineHeight: _lineHeight} : null;
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
     * 渲染主场景
     */
	render () {

        let {fontSize, color, fontWeight, lineHeight, textAlign, ...other} = this._inputContainerStyle;

        let {...props} = this.props;

		return (
			<EasyFieldFrame 
                ref = {(c) => {
                    this.props.registerChild(this.props.name, this, '1');
                }} 
                _fieldType = "textInput" 
                _realFieldComponent = {this._getTextInput(fontSize, color, fontWeight, lineHeight, textAlign)} 
                {...props} 
                _clear = {this._clear} 
                _adjust = {this._adjust} 
                _value = {this.state.value}
                _error = {this.state.error} 
            />
		);
	}

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 0,
    },
});

export default EasyTextInputField;

