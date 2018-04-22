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
import Icon             from 'rn-easy-icon';

import EasyFieldFrame   from './EasyFieldFrame';
import EasyDatePicker   from '../EasyDatePicker';
import moment           from 'moment';

class EasyDatePickerField extends Component {

    static displayName = '_EasyDatePickerField_';
    static description = 'DatePicker for EasyForm';

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
         * 选择类型
         * 日期 | 时间 | 日期加时间
         * @type {[type]}
         */
        mode: PropTypes.oneOf(['date', 'time', 'datetime']),

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

    };

    static defaultProps = {
        mode: 'date',
        iconLib: 'Ionicons',
        showClearIcon: true,
    };

	state = {
        value: this.props.value,
        date: null,
        hour: null,
        minute: null,

        dateStr: null,
        timeStr: null,
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

        this._getField          = this._getField.bind(this);
        this._clear             = this._clear.bind(this);
        this._onPicked          = this._onPicked.bind(this);
        this._getClearIcon      = this._getClearIcon.bind(this);
        this._parseValue        = this._parseValue.bind(this);
        this._generateValue     = this._generateValue.bind(this);
    }

    componentDidMount () {
        this._parseValue(this.props.value);
    }

    componentWillReceiveProps (props) {
        if(props['value'])
            this.setState({value: props['value']}, () => this._parseValue(props['value']));
        else
            this.setState({value: null});
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
     * props.value to date、 hour and minute
     */
    _parseValue (value) {
        //console.log(value);
        try {
            if(value) {
                let dt, ta, day;
                switch (this.props.mode) {
                    case 'date':
                        day = moment(value).toDate();
                        //console.log('day from moment : ' + day);
                        this.setState({
                            date: day,
                        });
                        break;
                    case 'time':
                        ta = value.split(':');
                        this.setState({
                            hour: parseInt(ta[0]),
                            minute: parseInt(ta[1]),
                        });
                        break;
                    case 'datetime':
                        day = moment(value).toDate();
                        //console.log('day from moment : ' + day);
                        dt = value.split(' ');
                        this.setState({
                            date: day,
                            hour: day.getHours(),
                            minute: day.getMinutes(),
                            dateStr: dt[0],
                            timeStr: dt[1],
                        });
                        break;
                    default:
                        break;
                }
            }
        } catch (e) {
            console.log('EasyDatePickerField._parseValue : init value is invalid.');
        }
    }

    /**
     * date to state.value
     */
    _generateValue () {
        //console.log('this.state.date : ' + this.state.date);
        if(this.state.date) {

            let day = moment(this.state.date), value;

            switch (this.props.mode) {
                case 'date':
                    value = day.format('YYYY-MM-DD');
                    break;
                case 'time':
                    value = day.format('HH:mm');
                    break;
                case 'datetime':
                    value = day.format('YYYY-MM-DD HH:mm');
                    break;
                default:
                    break;
            }

            this.setState({
                value: value,
            }, this._parseValue());

            return value;
        }
    }

    /**
     * 选择器选择完成后触发
     */
    _onPicked (date) {

        //console.log('mode time : ', date);
        this.setState({date: date}, () => {
            let value = this._generateValue();

            if(typeof this.props.onChange == 'function')
                this.props.onChange(this.props.name, value);
        });
    }

    /**
     * 清除输入框内容
     */
    _clear () {
        this.setState({
            value: '',
        });
        if(typeof this.props.onChange == 'function')
            this.props.onChange(this.props.name, '');
    }

    /**
     * get clear icon for android
     */
    _getClearIcon () {
        let clearIcon = this.state.value ?
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

    _showPicker (type) {
        //console.log(type);
        if(type == 'ATP') {
            this._picker.pickTime({
                hour: this.state.hour,
                minute: this.state.minute,
            }, (date) => this._onPicked(date));
        } else {
            //console.log(this.props.mode);
            let config;
            switch (this.props.mode) {
                case 'date':
                    //console.log('case date');
                    config = {};
                    config['date'] = this.state.date ? this.state.date : new Date();
                    //console.log('pickDate() config : ', config);
                    this._picker.pickDate(config, (date) => this._onPicked(date));
                    break;
                case 'time':
                    //console.log('case time');
                    config = {};
                    if(this.state.hour) config['hour'] = this.state.hour;
                    if(this.state.minute) config['minute'] = this.state.minute;
                    //console.log('pickTime() config : ', config);
                    this._picker.pickTime(config, (date) => this._onPicked(date));
                    break;
                case 'datetime':
                    //console.log('case datetime');
                    config = {};
                    config['date'] = this.state.date ? this.state.date : new Date();
                    //console.log('pickDateTime() config : ', config);
                    this._picker.pickDateTime(config, (date) => this._onPicked(date));
                    break;
                default:
                    break;
            }

        }
    }

    /**
     * get Field
     * @param  {[object]} fontSize   [style - fontSize]
     * @param  {[object]} color      [style - color]
     * @param  {[object]} fontWeight [style - fontWeight]
     * @param  {[object]} lineHeight [style - lineHeight]
     * @param  {[object]} textAlign  [style - textAlign]
     * @return {[node]}              []
     */
    _getField (_fontSize, _color, _fontWeight, _lineHeight, _textAlign) {

        _fontSize    = _fontSize            ? {fontSize: _fontSize} : null;
        _color       = _color               ? {color: _color} : null;
        _fontWeight  = _fontWeight          ? {fontWeight: _fontWeight} : null;
        _lineHeight  = _lineHeight          ? {lineHeight: _lineHeight} : null;
        _textAlign   = this.props.textAlign ? {textAlign: this.props.textAlign} : (_textAlign ? {textAlign: _textAlign} : null);

        let t1 = this.state.value, t2 = null, picker2 = null;

        //TODO: 如果是Android，是不是可以有同时选择日期和时间的替代方案
        /*if (this.props.mode == 'datetime' && Platform.OS == 'android') {
            t1 = this.state.dateStr;
            t2 = this.state.timeStr;

            picker2 = (
                <TouchableOpacity style = {{flex: 1, flexDirection: 'row', height: this._inputInnerHeight, alignItems: 'center', justifyContent: 'center'}}
                    onPress = {() => this._showPicker('ATP')} >
                    <Text style = {[{flex: 1}, styles.textInput, _fontSize, _color, _fontWeight, _lineHeight, _textAlign, phStyle]} >{t2}</Text>
                </TouchableOpacity>
            );
        }*/

        let phStyle = t1 ? null : {color: 'rgba(187,187,187,1)'};
        t1 = t1 ? t1 : this.props.placeholder;

        return (
            <View style = {{flex: 1, height: this._inputHeight, flexDirection: 'row'}} >
                <EasyDatePicker ref = {(c) => this._picker = c} />

                <TouchableOpacity style = {{flex: 1, flexDirection: 'row', height: this._inputInnerHeight, alignItems: 'center', justifyContent: 'center'}}
                    onPress = {() => this._showPicker()} >
                    <Text style = {[{flex: 1}, styles.textInput, _fontSize, _color, _fontWeight, _lineHeight, _textAlign, phStyle]} >{t1}</Text>
                </TouchableOpacity>

                {picker2}

                {this._getClearIcon()}

                <TouchableOpacity style = {{width: 30, height: this._inputHeight}} onPress = {() => this._showPicker()} >
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
                _fieldType = "date"
                _realFieldComponent = {this._getField(fontSize, color, fontWeight, lineHeight, textAlign)}
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

export default EasyDatePickerField;



