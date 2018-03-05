'use strict';

/** 复选框
  * onCheck:选中后回调的方法
  * onUncheck：取消选中后回调的方法
  * checked : true | flase 初始状态
  * style : 添加样式
  * color : 选中时颜色
  * bgcolor:复选框背景颜色
  * iconSize ： 复选框内图标大小 可选nomal | small | large
  * size : 复选框大小,数字,自定义
  * refresh
  * ———————————————————————————————————————————
  * Author : 39Er
  * 简单实现，有问题再优化~^o^~
**/
import React, {
  Component,
  PropTypes,
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import * as Global  from '../Global';
import EasyIcon     from 'rn-easy-icon';

class Checkbox extends Component {
    //限制属性类型
    static propTypes = {
        onCheck: React.PropTypes.func,
        onUncheck: React.PropTypes.func,
        size: React.PropTypes.number,
        backgroundColor: React.PropTypes.string,
        color: React.PropTypes.string,
        iconSize: React.PropTypes.string,
        checked: React.PropTypes.bool,
        // style: React.PropTypes.func,
    };

    static defaultProps = {
        onCheck: null,
        onUncheck: null,
        size: 30,
        backgroundColor: 'white',
        color: Global._colors.IOS_BLUE,
        iconSize: 'normal',
        checked: false,
    };

	state = {
        // checked: this.props.checked,
	};

    componentWillReceiveProps(props) {
        // if (props.refresh) {
        //     if (props.checked == true) {
        //         if(this.state.checked == false){
        //             this.setState({checked:props.checked});
        //         }
        //     } else {
        //         this.setState({checked: this.props.checked});
        //         if (this.props.onUncheck) {
        //             this.props.onUncheck();
        //         }
        //     }
        // }
    }
    _getCheckStyle() {
        return {
            // width: this.props.size,
            // height: this.props.size,
            // backgroundColor: this.state.bg_color,
            // borderColor: Global._colors.NAV_BAR_LINE,
            // borderWidth: 1,
            // borderRadius: this.props.size/2,
            // justifyContent: 'center',
            // alignItems: 'center',
            // padding: 2,
        };
    }
    _getIconSize() {
        if (this.props.iconSize == 'small') {
            return this.props.size * 0.7;
        } else if (this.props.iconSize == 'normal') {
            return this.props.size * 0.8;
        } else if (this.props.iconSize == 'large') {
            return this.props.size * 0.9;
        } else {
            return this.props.size * 0.8;
        }
    }

    _getIconStyle() {
        return {
            width: this._getIconSize(),
            height: this._getIconSize(),
            backgroundColor:'transparent'
        };
    }

    _completeProgress() {
        // if (this.state.checked) {
        //     this.setState({
        //         checked: false,
        //     });
        //     if (this.props.onUncheck) {
        //         this.props.onUncheck();
        //     }
        // } else {
        //     this.setState({
        //         checked: true,
        //     });
        //     if (this.props.onCheck) {
        //         this.props.onCheck();
        //     }
        // }
        if ( this.props.onPress != null && 'function' == typeof this.props.onPress ) {
            this.props.onPress();
        }
    }

    render(){
        var icon = this.props.checked ?
                <EasyIcon iconLib = 'fa' name='check-circle' size={this._getIconSize()} color={this.props.color} style={[this._getIconStyle(), {marginRight:8,}]} />:
                <EasyIcon iconLib = 'fa' name='circle-thin'  size={this._getIconSize()} color={this.props.color} style={[this._getIconStyle(), {marginRight:8,}]} />;
        return (
                <TouchableOpacity style={[this.props.style]} onPress={()=>this._completeProgress()}>
                    {icon}
                    {this.props.children}
                </TouchableOpacity>
        );
    }
}


module.exports = Checkbox;
