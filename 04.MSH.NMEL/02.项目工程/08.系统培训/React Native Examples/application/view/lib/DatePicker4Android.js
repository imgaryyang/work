'use strict';
/** Android日期选择框
  * date (Date对象或毫秒时间戳) - 默认显示的日期
  * minDate (Date对象或毫秒时间戳) - 可选的最小日期
  * maxDate (Date对象或毫秒时间戳) - 可选的最大日期
  * text 按钮提示信息
  * styles 样式
  * btnStyle 按钮样式
  * getDate 确定选中日期后执行的方法
  * dateText 初始输入框中显示的日期
**/
var React = require('react-native');
var {
  DatePickerAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} = React;


var DatePicker4Android = React.createClass({

  getInitialState() {
    return {
      date:  new Date(),
      text: this.props.text?this.props.text:'请选择日期',
      dateText : this.props.dateText?this.props.dateText:'',
    };
  },

  componentWillReceiveProps: function(props) {
      console.log('props ***********'+props.dateText);
      if(props.dateText){
        this.setState({dateText:props.dateText});
      }
  },
  async showPicker(stateKey, options) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open(options);      
      if (action === DatePickerAndroid.dismissedAction) {
        //点击取消事件

      } else {
        console.log(year +'--'+month+'--'+day);
        var date = new Date(year, month, day);
        var mm = (month+1)>9?month+1:'0'+(month+1);
        var dd = day>9?day:'0'+day;
        this.setState({dateText: (year+'-'+ mm + '-' + dd)});
        if(this.props.getDate)
          this.props.getDate(date);
      }
    } catch ({code, message}) {
      console.warn('Error in datePicker: ', message);
    }
  },

  render() {
    var options = {date : this.state.date};
    if(this.props.minDate){
        options.minDate = this.props.minDate;
    }
    if(this.props.maxDate){
      options.maxDate = this.props.maxDate;
    }
    return (
      <View style={[{flexDirection:'row'},this.props.styles]}>
          <TextInput style={[styles.input]}value={this.state.dateText}  />
          <TouchableOpacity styles={this.props.btnStyle}
            onPress={this.showPicker.bind(this, 'all', options)}>
            <Text style={styles.text}>{this.state.text}</Text>
          </TouchableOpacity>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  text: {
    color: '#007AFF',
    flex:1,
  },
  input: {
    flex: 1,
    height: 36,
    padding: 7,
    marginBottom: 5,
    fontSize: 13,
    borderRadius: 4,
    borderColor: '#cccccc',
    borderWidth: 0.5
  }
});

module.exports = DatePicker4Android;