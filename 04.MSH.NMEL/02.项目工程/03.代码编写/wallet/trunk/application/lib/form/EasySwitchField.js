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
    Switch,
} from 'react-native';

import Icon             from 'rn-easy-icon';

import EasyFieldFrame   from './EasyFieldFrame';

class EasySwitchField extends Component {

    static displayName = '_EasySwitchField_';
    static description = 'Switch for EasyForm';

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
        value: PropTypes.bool,

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
    	//appendComponent: PropTypes.node,

    };

    static defaultProps = {
        value: false,
        disabled: false,
    };

	state = {
        //value: this.props.value,
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

        this._getSwitch         = this._getSwitch.bind(this);
    }

    componentDidMount () {
    }

    componentWillReceiveProps (props) {
        /*if(props['value'])
            this.setState({value: props['value']});
        else
            this.setState({value: null});*/
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
        //value = this._generateValue(value);
        /*this.setState({
            value: value
        }, () => {*/
            if(typeof this.props.onChange == 'function')
                this.props.onChange(this.props.name, value);
        //});
    }

    /**
     * 取checkbox group
     */
    _getSwitch () {
        return (
            <View style = {{
                flex: 1, 
                height: this._inputInnerHeight, 
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
                paddingLeft: 5,
                paddingRight: 10,
            }} >
                <Switch 
                    disabled = {this.props.disabled} 
                    value = {this.props.value} 
                    onValueChange = {this.onChange} 
                    style = {{marginRight: 15}}
                />
                {this.props.children}
            </View>
        );
    }

    render () {
        let {config, ...props} = this.props;

        return (
            <EasyFieldFrame 
                ref = {(c) => {
                    this.props.registerChild(this.props.name, this, '1');
                }} 
                _fieldType = "switch" 
                _realFieldComponent = {this._getSwitch()} 
                config = {config} 
                {...props} 
                showClearIcon = {false} 
                _value = {this.props.value + ''} 
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

export default EasySwitchField;



