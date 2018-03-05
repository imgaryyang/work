/**
* 自定义布尔型组件
* labelPos 			null | tail 	label位置，值为tail时label显示在switch开关后面（主要用于“是否同意**协议”的场景），不填或为其它非法值的时候正常显示
* labelComponent					用object自定义label，labelComponent存在时label失效
* 
*/
import React, {
    Component,
    PropTypes,
} from 'react';

import {
    Platform,
    Dimensions,
    PixelRatio,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import Switcher from './Switcher';
import t from 'tcomb-form-native';

class TcombBool extends t.form.Component {

    /**
    * 构造函数，声明初始化 state
    */
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }

    /**
    * 取选项值
    */
    getValue() {
        return this.state.value;
    }

    /**
    * 选项发生改变时调用
    */
    onChange(state) {
    	//console.log(state);
        this.setState({value: state}, () => {
        	this.props.onChange(this.state.value, this.props.ctx.path);
        });
    }

    /**
    * 模板
    */
    getTemplate() {
    	//onChange = this.onChange;
        return (locals) => {

        	var stylesheet = locals.stylesheet;
            var formGroupStyle = stylesheet.formGroup.normal;
            var controlLabelStyle = stylesheet.controlLabel.normal;
            var helpBlockStyle = stylesheet.helpBlock.normal;
            var errorBlockStyle = stylesheet.errorBlock;

            if (locals.hasError) {
                formGroupStyle = stylesheet.formGroup.error;
                controlLabelStyle = stylesheet.controlLabel.error;
                helpBlockStyle = stylesheet.helpBlock.error;
            }
            var help = locals.help ? <Text style = {[helpBlockStyle, {marginTop: 5,}]}>{locals.help}</Text> : null;
            var error = locals.hasError && locals.error ? <Text style = {[errorBlockStyle, {marginTop: 5,}]}>{locals.error}</Text> : null;

        	var label = null;
        	if(locals.labelComponent) {
        		label = locals.labelComponent;
        	} else {
        		label = locals.label ? <Text style = {controlLabelStyle}>{locals.label}</Text> : null;
        	}

            return (
                <View 
                    style = {formGroupStyle} 
                    ref = 'input'>

                    {locals.labelPos != 'tail' ? label : null}

                    <View style = {[styles.inputContainer]}>
                    	<Switcher 
				            onSwitch = {(state) => {
				            	this.onChange(state);
				            }} 
				            style = {[styles.switcher]} />
				        {locals.labelPos === 'tail' ? (<View style = {styles.tail} >{label}</View>) : null}
                    </View>

                    {help}
                    {error}

                </View>
            );
        };
    }

    getLocals() {
        var locals = super.getLocals();
        [
            'labelPos',
            'labelComponent',
            /*'onActivate',
            'onDeactivate',
            'onChangeState',*/
        ].forEach((name) => locals[name] = this.props.options[name]);

        return locals;
    }

}

var styles = StyleSheet.create({
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
	},
    switcher: {
    	width: 50,
    },
    tail: {
    	backgroundColor: 'transparent',
    	flex: 1,
    	paddingTop: 7,
    	paddingLeft: 8,
    },
});

module.exports = TcombBool;

