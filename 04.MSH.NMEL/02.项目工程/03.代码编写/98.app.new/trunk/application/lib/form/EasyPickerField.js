'use strict';

import React, {
    Component,
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

import PropTypes from 'prop-types';
// import Icon             from 'rn-easy-icon';

import EasyFieldFrame   from './EasyFieldFrame';
import EasyPicker       from  'rn-easy-picker';

class EasyPickerField extends Component {

    static displayName = '_EasyPickerField_';
    static description = 'Picker for EasyForm';

    _textInput         = null;
    _picker            = null;

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
         * 被选择的数据源
         */
    	dataSource: PropTypes.array.isRequired,

    };

    static defaultProps = {
        iconLib: 'Ionicons',
        showClearIcon: true,
    };

	state = {
        value: this.props.value,
        text: '',
	};

    constructor (props) {
        super(props);
        //configs
        this._textInputConfig   = this.props.config.fields.textInput;
        this._inputContainerStyle = this.props.config.fields.textInput.style;
        this._inputHeight       = this._inputContainerStyle.height ? this._inputContainerStyle.height : 35;
        this._inputInnerHeight  = Platform.OS == 'android' ? this._inputHeight - (2 / PixelRatio.get()) : this._inputHeight;
        //methods
        this.validate           = this.validate.bind(this);
        this.showError          = this.showError.bind(this);
        this.onChangeText       = this.onChangeText.bind(this);
        this._clear             = this._clear.bind(this);
        this._onPicked          = this._onPicked.bind(this);
    }

    componentDidMount () {
        //register real TextInput event
        /*this.focus              = this._textInput.focus;
        this.blur               = this._textInput.blur;
        this.clear              = this._textInput.clear;*/

        if(this.state.value)
            for (let item of this.props.dataSource) {
                if(this.state.value == item.value) {
                    this.setState({text: item.label});
                    return;
                }
            }
    }

    componentWillReceiveProps (props) {
        if(props['value'])
            this.setState({value: props['value']});
        else
            this.setState({value: null,text: ''});
    }

    /**
     * 输入域校验
     */
    validate () {
        if (this.props.required && !this.state.value) { //判断非空
            this.setState({error: this.props.label + '必须填写！'});
            return false;
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
     * 选择器选择完成后触发
     */
    _onPicked (item) {

        if(!item) return;

        this.setState({text: item.label});

        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.props.name, item.value + '');
    }

    /**
     * 清除输入框内容
     */
    _clear () {
        //if(this._textInput) {
            //this._textInput.clear();
        //}
        this.setState({
            value: null,
            text: '',
        });
        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.props.name, '');
    }

    /**
     * get clear icon for android
     */
    _getClearIcon () {
        let clearIcon = this.state.text ? 
            (
                <TouchableOpacity onPress = {() => this._clear()} >
                    <Icon 
                        iconLib = "Ionicons" 
                        name    = {Platform.OS == 'ios' ? "md-close-circle" : "ios-close"} 
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

        return (
            <View style = {{flex: 1, height: this._inputHeight, flexDirection: 'row'}} >
                <TouchableOpacity style = {{flex: 1, height: this._inputHeight}} onPress = {() => this._picker.toggle()} >
                    <EasyPicker 
                        ref = {(c) => this._picker = c}
                        dataSource = {this.props.dataSource}
                        selected = {this.state.value}
                        onChange = {this._onPicked}
                    />
                    <TextInput 
                        ref = {(c) => {
                            this._textInput = c;
                            this.props.registerChild(this.props.name, c, '2');
                        }} 
                        value = {this.state.text} 
                        placeholder = {this.props.placeholder} 
                        onChangeText = {this.onChangeText} 
                        style = {[styles.textInput, _fontSize, _color, _fontWeight, _lineHeight, _textAlign]} 
                        clearButtonMode = 'never' 
                        underlineColorAndroid = "transparent" 
                        editable = {false} 
                    />
                </TouchableOpacity>
                {this._getClearIcon()}
                <TouchableOpacity style = {{width: 30, height: this._inputHeight}} onPress = {() => this._picker.toggle()} >
                    <Icon 
                        iconLib = "Ionicons" 
                        name    = "md-more" 
                        size    = {20} 
                        color   = 'gray' 
                        width   = {30} 
                        height  = {this._inputHeight} 
                    />
                </TouchableOpacity>
            </View>
        );

    }

    render () {

        let {fontSize, color, fontWeight, lineHeight, textAlign, ...other} = this._inputContainerStyle;

        let {...props} = this.props;

        return (
            <EasyFieldFrame 
                ref = {(c) => {
                    this.props.registerChild(this.props.name, this, '1');
                }} 
                _fieldType = "picker" 
                _realFieldComponent = {this._getTextInput(fontSize, color, fontWeight, lineHeight, textAlign)} 
                {...props} 
                showClearIcon = {false} 
                _value = {this.state.value} 
                _error = {this.state.error} />
        );
    }

}

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },
});

export default EasyPickerField;



