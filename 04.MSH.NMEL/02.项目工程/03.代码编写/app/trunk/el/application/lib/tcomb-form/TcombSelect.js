/**
* 自定义选择域，options.fields 中可定义如下个性化参数：
* 
* type:         single  | multi             单选 / 多选
* display:      row     | one-row   | cols  行显示（顺序显示，可折行）/ 使用flex显示在一行 / 显示为列
* disabled:     true    | false             是否禁用
* options:                                  所有选项
* icon:                                     显示在选项前的图标
* activeIcon:                               选中状态的图标
* style:                                    自定义样式表
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

import t from 'tcomb-form-native';

function getOptions(options) {
    return Object.keys(options).map(value => {
        return {
            value,
            text: options[value]
        };
    });
}

class TcombSelect extends t.form.Component {

    /**
    * 构造函数，声明初始化 state
    */
    constructor(props) {
        super(props);
        /*console.log('xxxxxxxxxxxxxxx props in constructor:');
        console.log(props);
        console.log('xxxxxxxxxxxxxxx end of props in constructor:');*/

        this.type       = props.options.type && 'single;multi'.indexOf(props.options.type) != -1 ? props.options.type : 'single';
        this.display    = props.options.display && 'row;one-row;col'.indexOf(props.options.display) != -1 ? props.options.display : 'row';
        this.disabled   = props.options.disabled === true ? true : false;
        this.icon       = props.options.icon ? props.options.icon : null;
        this.activeIcon = props.options.activeIcon ? props.options.activeIcon : null;
        this.options    = props.options.options;
        this.style      = props.options.style;

        /*console.log('------- this.icon -------');
        console.log(this.icon);*/

        this.state      = {
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
    * 得到所有选项配置
    */
    /*getEnum() {
        return this.typeInfo.innerType;
    }*/

    /**
    * 选项发生改变时调用
    */
    onChange(optionValue) {
        this.setState({value: this.generateValue(optionValue)}, () => this.props.onChange(this.state.value, this.props.ctx.path));
    }

    /**
    * 根据规则生成最终值
    */
    generateValue(value) {
        /*if(value == null)
            return null;*/
        if(this.type == 'single') {
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
    optionSelected(value) {
        var v = ';' + this.state.value + ';';
        return v.indexOf(value) == -1 ? false : true;
    }

    /**
    * 模板
    */
    getTemplate() {
        return (locals) => {
            /*console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> locals in getTemplate().');
            console.log(locals);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> end of locals in getTemplate().');*/
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

            var label = locals.label ? <Text style = {controlLabelStyle}>{locals.label}</Text> : null;
            var help = locals.help ? <Text style = {[helpBlockStyle, {marginTop: 5,}]}>{locals.help}</Text> : null;
            var error = locals.hasError && locals.error ? <Text style = {[errorBlockStyle, {marginTop: 5,}]}>{locals.error}</Text> : null;

            var style;
            if(this.style)                      style = this.style;
            else if(this.display == 'col')      style = colStyles;
            else if(this.display == 'one-row')  style = oneRowStyles;
            else                                style = rowStyles;

            var arrOptions = getOptions(this.options);
            //生成所有选项
            var options = arrOptions.map (
                ({value, text}, idx) => {

                    var icon = this.optionSelected(value) ? this.activeIcon : this.icon;

                    var selectedStyle = this.optionSelected(value) ? style.selectedOption : {};
                    var selectedTextStyle = this.optionSelected(value) ? style.selectedOptionText : {};

                    var folStyle = {};
                    if(idx == 0) folStyle = style.firstOption;
                    else if(idx == arrOptions.length - 1) folStyle = style.lastOption;

                    return (
                        <TouchableOpacity 
                            key = {value}
                            style = {[style.option, folStyle, selectedStyle]} 
                            onPress = {()=>{
                                //如果选择域被禁用，则禁用点击事件
                                if(this.disabled === true)
                                    return;

                                //回调onChange
                                this.onChange(value);
                            }}>
                            {icon}
                            <Text style = {[style.optionText, selectedTextStyle]}>{text}</Text>
                        </TouchableOpacity>
                    );
                }
            );

            return (
                <View 
                    style = {formGroupStyle} 
                    ref = 'input'>
                    {label}
                    <View style = {style.optionsContainer}>{options}</View>
                    {help}
                    {error}
                </View>
            );
        };
    }

    getLocals() {
        var locals = super.getLocals();
        [
            'help',
            'type',
            'display',
            'disabled',
            'icon',
            'activeIcon',
            'options',
            'style',
        ].forEach((name) => locals[name] = this.props.options[name]);

        return locals;
    }
}

var rowStyles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
    },
    option: {
        height: 36,
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#CCC',
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 4,
        marginRight: 10,
        marginBottom: 5,
        backgroundColor: '#ffffff',
    },
    firstOption: {
    },
    lastOption: {
    },
    optionText: {
        flex: 1,
        textAlign: 'center',
    },
    selectedOption: {
        backgroundColor: '#eeeeee',
    },
    selectedOptionText: {
        //color: '#ffffff',
    },
});

var oneRowStyles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden', 
    },
    option: {
        height: 36,
        flex: 1,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#CCC',
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#ffffff',
    },
    firstOption: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
    },
    lastOption: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    optionText: {
        flex: 1,
        textAlign: 'center',
    },
    selectedOption: {
        backgroundColor: '#eeeeee',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#CCC',
    },
    selectedOptionText: {
        //color: '#ffffff',
    },
});

var colStyles = StyleSheet.create({
    optionsContainer: {
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden', 
    },
    option: {
        height: 36,
        flex: 1,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#CCC',
        alignItems: 'center', 
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
    },
    firstOption: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    lastOption: {
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
    },
    optionText: {
        flex: 1,
    },
    selectedOption: {
        backgroundColor: '#eeeeee',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#CCC',
    },
    selectedOptionText: {
        //color: '#ffffff',
    },
});

module.exports = TcombSelect;
