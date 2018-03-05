'use strict';
/** Android时间选择框
  * hour (0-23) - 要显示的小时，默认为当前时间。
  * minute (0-59) - 要显示的分钟，默认为当前时间。
  * is24Hour (boolean) - 如果设为true，则选择器会使用24小时制。如果设为false，则会额外显示AM/PM的选项。如果不设定，则采取当前地区的默认设置。
  * text 按钮提示信息
  * styles 样式
  * btnStyle 按钮样式
  * getTime 确定选中时间后执行的方法
  * timeText 初始输入框中显示的时间
*/
var React = require('react-native');
var {
  TimePickerAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} = React;


var TimePicker4Android = React.createClass({

  getInitialState() {
    // *Text, *Hour and *Minute are set by successCallback -- this updates the text with the time
    // picked by the user and makes it so the next time they open it the hour and minute they picked
    // before is displayed.
    // console.log('timeText****************'+this.props.timeText);
    return {
        timeText :this.props.timeText?this.props.timeText:'',
        text: this.props.text?this.props.text:'请选择时间',
    };
  },

  componentWillReceiveProps: function(props) {
      // console.log('props ***********'+props.timeText);
      if(props.timeText){
        this.setState({timeText:props.timeText});
      }
  },
  async showPicker(options) {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open(options);
      if (action === TimePickerAndroid.timeSetAction) {
        this.setState({timeText:_formatTime(hour, minute)});
        if(this.props.getTime){
          this.props.getTime(hour,minute,this.state.timeText);
        }
      } else if (action === TimePickerAndroid.dismissedAction) {
        //点击取消执行
      }
    } catch ({code, message}) {
      console.warn('Error in timePicker : ', message);
    }
  },

  render() {
    var options = {};
    if(this.props.hour){
      options.hour = this.props.hour;
    }
    if(this.props.minute){
      options.minute = this.props.minute;
    }
    if(this.props.is24Hour != null && this.props.is24Hour != undefined){
      options.is24Hour = this.props.is24Hour;
    }
    return (
      <View style={[{flexDirection:'row'},this.props.styles]}>
          <TextInput style={{flex:1,height:40}} value={this.state.timeText} />
          <TouchableOpacity style={this.props.btnStyle}
            onPress={this.showPicker.bind(this, options)}>
            <Text style={styles.text}>{this.state.text}</Text>
          </TouchableOpacity>
      </View>
    );
  },
});

/**
 * Returns e.g. '3:05'.
 */
function _formatTime(hour, minute) {
  return (hour<10?'0'+hour:hour) + ':' + (minute < 10 ? '0' + minute : minute);
}

var styles = StyleSheet.create({
  text: {
    color: '#007AFF',
  },
});

module.exports = TimePicker4Android;