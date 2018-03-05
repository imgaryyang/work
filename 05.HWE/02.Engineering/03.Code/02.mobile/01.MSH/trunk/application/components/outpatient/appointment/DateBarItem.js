import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import Global from '../../../Global';

const itemSize = (Global.getScreen().width - (Global.lineWidth * 6)) / 7;

export default class DateBarItem extends PureComponent {
  static getFormatWeek(date, i) {
    switch (i) {
      case 0:
        return '今天';
      case 1:
        return '明天';
      default:
        return `周${'日一二三四五六'.charAt(date.day())}`;
    }
  }

  static fetchDateBarData() {
    const date = moment();
    const dateBarData = [];

    dateBarData.push({
      date: null,
      format10: '日期',
      format5: '日期',
      formatWeek: '全部',
    });

    for (let i = 0; i < 14; i++) {
      dateBarData.push({
        date,
        format10: date.format('YYYY-MM-DD'),
        format5: date.format('MM-DD'),
        formatWeek: DateBarItem.getFormatWeek(date, i),
      });
      date.add(1, 'days');
    }
    return dateBarData;
  }

  onPress = () => {
    this.props.onPress(this.props.data, this.props.index);
  };

  render() {
    const { data, selected } = this.props;
    const { formatWeek, format5 } = data;
    const itemStyle = selected ? styles.dateBarItemSelected : styles.dateBarItem;
    const textStyle = selected ? styles.dateBarTextSelected : styles.dateBarText;
    const dateTextSize = format5 === '日期' ? 14 : 11;

    return (
      <TouchableOpacity style={itemStyle} onPress={this.onPress}>
        <Text style={[textStyle, { fontSize: 14 }]}>{formatWeek}</Text>
        <Text style={[textStyle, { fontSize: dateTextSize }]}>{format5}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  dateBarText: {
    textAlign: 'center',
    padding: 4,
    color: Global.colors.FONT_GRAY,
  },
  dateBarTextSelected: {
    textAlign: 'center',
    padding: 5,
    color: 'white',
  },
  dateBarItem: {
    paddingVertical: 5,
    width: itemSize,
    height: itemSize,
    justifyContent: 'space-around',
  },
  dateBarItemSelected: {
    paddingVertical: 4,
    width: itemSize,
    height: itemSize,
    justifyContent: 'space-around',
    backgroundColor: Global.colors.IOS_BLUE,
  },
});
