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

class EasyCheckboxField extends Component {

    static displayName = '_EasyCheckboxField_';
    static description = 'Checkbox for EasyForm';

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
         * check type
         * single | multi  单选 / 多选
         */
        type: PropTypes.string,

        /**
         * display type
         * row | col  使用flex显示在一行 / 显示为列
         */
        display: PropTypes.string,

        /**
         * 输入域初始值
         */
        value: PropTypes.string,

        /**
         * disabled state
         */
        disabled: PropTypes.bool,

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
        type: 'single',
        display: 'row',
        disabled: false,
    };

	state = {
        value: this.props.value,
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
        this.onChange           = this.onChange.bind(this);

        this._generateValue     = this._generateValue.bind(this);
        this._optionSelected    = this._optionSelected.bind(this);
        this._getCheckboxItems  = this._getCheckboxItems.bind(this);
        this._getCheckboxGroup  = this._getCheckboxGroup.bind(this);
    }

    componentDidMount () {
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
    onChange (value) {
        value = this._generateValue(value);
        this.setState({
            value: value
        }, () => {
            if(typeof this.props.onChange == 'function')
                this.props.onChange(this.props.name, value);
        });
    }

    /**
    * 根据规则生成最终值
    */
    _generateValue(value) {
        /*if(value == null)
            return null;*/
        if(this.props.type == 'single') {
            if(value == this.state.value)
                return null;
            return value;
        } else {
            if(this.state.value == null)
                return value;
            var v = ';' + this.state.value + ';';
            if(v.indexOf(';' + value + ';') == -1)
                return this.state.value + ';' + value;
            else {
                v = v.replace(';' + value + ';', ';');
                if(v == ';')
                    return null;
                v = v.substring(1, v.length);
                v = v.substring(0, v.length - 1);
                return v;
            }
        }
    }

    /**
    * 判断选项是否在被选中状态
    */
    _optionSelected(value) {
        var v = ';' + this.state.value + ';';
        return v.indexOf(value) == -1 ? false : true;
    }

    /**
     * generate items
     */
    _getCheckboxItems () {
        return this.props.dataSource.map((item, idx) => {

            let checked = this._optionSelected(item.value);
            let iconName = checked ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline';
            let iconColor = checked ? 'rgba(255,102,0,1)' : 'rgba(130,130,130,1)';

            /*let line = null;
            if(this.props.display == 'row' && idx < this.props.dataSource - 1) {
                line = (<View style = {{
                    width: 1 / PixelRatio.get(), 
                    height: this._inputInnerHeight - 10,
                    color: 'rgba(200,199,204,1)', 
                    maringTop: 5, 
                }} />);
            } else if (this.props.display == 'col' && idx < this.props.dataSource - 1) {
                //line = (<View />);
            }*/

            let sepStyle = null;
            if (this.props.display == 'col' && idx < this.props.dataSource.length - 1) {
                sepStyle = {
                    borderBottomWidth: 1 / PixelRatio.get(),
                    borderBottomColor: 'rgba(187,187,187,1)',
                    
                };
            }

            return (
                <TouchableOpacity key = {this.props.name + '_cb_' + idx} 
                    onPress = {() => {
                        //如果选择域被禁用，则禁用点击事件
                        if(this.props.disabled)
                            return;

                        //回调onChange
                        this.onChange(item.value);
                    }}
                    style = {[sepStyle, {
                        flex: 1, 
                        height: this._inputInnerHeight, 
                        flexDirection: 'row', 
                        backgroundColor: 'rgba(248,248,248,1)',
                        paddingLeft: 10, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                    }]} >
                    <Icon name = {iconName} color = {iconColor} size = {20} width = {30} />
                    <Text style = {[{
                        flex: 1
                    }]} >{item.label}</Text>
                </TouchableOpacity>
            );
        });
    }

    /**
     * 取checkbox group
     */
    _getCheckboxGroup () {
        let fd = this.props.display == 'row' ? {flexDirection: 'row'} : null;
        return (
            <View style = {[{flex: 1}, fd]} >
                {this._getCheckboxItems()}
            </View>
        );
    }

    render () {
        let {config, ...props} = this.props;
        /*config.fields.label.showLabel = true;
        config.fields.label.position = 'top';*/
        return (
            <EasyFieldFrame 
                ref = {(c) => {
                    this.props.registerChild(this.props.name, this, '1');
                }} 
                _fieldType = "checkbox" 
                _realFieldComponent = {this._getCheckboxGroup()} 
                config = {config} 
                showLabel = {true} 
                labelPosition = "top" 
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

export default EasyCheckboxField;



