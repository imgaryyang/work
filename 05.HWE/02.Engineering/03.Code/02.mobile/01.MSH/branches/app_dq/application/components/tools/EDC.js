/**
 * 预产期自测
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Card from 'rn-easy-card';
import Button from 'rn-easy-button';

import DatePicker from '../../modules/EasyDatePicker';


class EDC extends Component {
  static displayName = 'EDC';
  static description = '预产期自测';

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={styles.container} />
    );
  }
  /**
     * 计算预产期函数
     *
     */
  static addDate(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    const val = `${d.getFullYear()}-${month}-${day}`;
    return val;
  }
  // 根据生日的月份和日期，计算星座。
  static getAstro(month, day) {
    const s = '魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
    const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr((month * 2) - (day < arr[month - 1] ? 2 : 0), 2);
  }
  // 根据生日的月份和日期，计算生肖。
  static getZodica(year) {
    const zodiacArr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
    return zodiacArr[year % 12];
  }
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.submit = this.submit.bind(this);
  }

  state = {
    doRenderScene: false,
    date: null,
    expected: [], // 预产期
    constellatory: '', // 星座
    zodiac: '', // 生肖
    modalVisible: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
  }
  onPress() {
    this.easyDatePicker.pickDate({ date: new Date() }, (date) => {
      const expected = EDC.addDate(date, 280);
      const constellatory = EDC.getAstro(date.getMonth() + 1, date.getDay());
      const zodiac = EDC.getZodica(date.getFullYear());
      this.setState({ date, expected, constellatory, zodiac });
    });
  }
  submit() {
    this.setState({ modalVisible: true });
  }


  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return EDC.renderPlaceholderView();
    }
    // console.log(this.state.date === null ? '选择日期' : this.state.date.toLocaleDateString());
    const text = this.state.date === null ? '选择日期' : this.state.date.toLocaleDateString();
    const result = () => {
      return (<Card >
        <Text>准妈妈，您的预产期是:</Text>
        <Text style={styles.showDate}>{this.state.expected}</Text>
        <Text >已怀孕0天(第0周第0天)，据宝宝出生还有280天。</Text>
        <Text >宝宝的星座将是:{this.state.constellatory}</Text>
        <Text >宝宝的生肖是:{this.state.zodiac}</Text>
      </Card>);
    };

    return (
      <View style={styles.container} >
        <Text style={styles.text}>末次月经时间:</Text>
        <DatePicker ref={(c) => { this.easyDatePicker = c; }} />
        <View style={styles.date} >
          <Button style={{ flex: 1 }} text={text} outline onPress={this.onPress} />
        </View>
        <View style={styles.date} >
          <Button style={{ flex: 1 }} text="预产期计算" onPress={this.submit} />

        </View>
        <Card style={styles.card} hideTopBorder hideBottomBorder>
          {this.state.modalVisible ? result() : null}
        </Card>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    marginLeft: 30,
    fontSize: 20,
    color: '#2C3742',
    fontFamily: 'PingFangSC-Regular',

  },
  date: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 20,
    marginRight: 15,
  },

  card: {
    marginTop: 30,

  },
  showDate: {
    fontSize: 20,
    color: 'red',
  },
});

EDC.navigationOptions = {
  title: '预产期自测',
};

export default EDC;
