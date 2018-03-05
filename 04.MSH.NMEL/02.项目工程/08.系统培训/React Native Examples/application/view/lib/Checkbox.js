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
var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Global = require('../../Global');
var {
  Text,
  View,
  TouchableOpacity,
} = React;

var Checkbox = React.createClass({
  //限制属性类型
  propTypes: {
    onCheck: React.PropTypes.func,
    onUncheck: React.PropTypes.func,
    size: React.PropTypes.number,
    backgroundColor: React.PropTypes.string,
    color: React.PropTypes.string,
    iconSize: React.PropTypes.string,
    checked: React.PropTypes.bool,
    // style: React.PropTypes.func,
  },
	getInitialState :function(){
    return {
      checked: this.props.checked,
    };
	},
  getDefaultProps: function() {
    return {
      onCheck: null,
      onUncheck: null,
      size: 30,
      backgroundColor: 'white',
      color: Global.colors.ORANGE,
      iconSize: 'normal',
      checked: false
    };
  },
  componentWillReceiveProps: function(props) {
    if (props.refresh) {
      if (props.checked == true) {
        if(this.state.checked == false){
          this.setState({checked:props.checked});
        }
      } else {
        this.setState({
          checked: this.props.checked
        });
        if (this.props.onUncheck) {
          this.props.onUncheck();
        }
      }
    }
  },
  _getCheckStyle: function() {
    return {
      // width: this.props.size,
      // height: this.props.size,
      backgroundColor: this.state.bg_color,
      // borderColor: Global.colors.NAV_BAR_LINE,
      // borderWidth: 1,
      // borderRadius: this.props.size/2,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    };
  },
   _getIconSize: function() {
    if (this.props.iconSize == 'small') {
      return this.props.size * 0.7;
    } else if (this.props.iconSize == 'normal') {
      return this.props.size * 0.8;
    }else if (this.props.iconSize == 'large') {
      return this.props.size * 0.9;
    } else {
      return this.props.size * 0.8;
    }
  },

  _getIconStyle: function() {
    return {
      color: this.props.color,
      flex: 1,
      width: this._getIconSize(),
      height: this._getIconSize(),
      backgroundColor:'transparent'
    };
  },
   _completeProgress: function() {
    if (this.state.checked) {
      this.setState({
        checked: false,
      });
      if (this.props.onUncheck) {
        this.props.onUncheck();
      }
    } else {
      this.setState({
        checked: true,
      });
      if (this.props.onCheck) {
        this.props.onCheck();
      }
    }
  },
  render : function(){
    var icon = this.state.checked?<Icon name='checkmark-circled' size={this._getIconSize()} color={this.props.color} style={this._getIconStyle()} />:<Icon name='ios-circle-outline' size={this._getIconSize()} color={this.props.color} style={this._getIconStyle()} />;
    return (
      <View style={this.props.style} >
          <TouchableOpacity style={this._getCheckStyle()} onPress={this._completeProgress}>
            {icon}
          </TouchableOpacity>
      </View>
    );
  },


});



module.exports = Checkbox;
