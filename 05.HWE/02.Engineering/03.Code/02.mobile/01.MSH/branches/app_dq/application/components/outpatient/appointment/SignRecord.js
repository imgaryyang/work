import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import moment from 'moment';
import Portrait from 'rn-easy-portrait';
import Icon from 'rn-easy-icon';
import { getStatusName } from './AppointRecord';
import Global from '../../../Global';
import ViewText from '../../../modules/ViewText';
import { base } from '../../../services/RequestTypes';

export default class SignRecord extends PureComponent {
  constructor(props) {
    super(props);

    this.dialog = null;
    this.onPress = this.onPress.bind(this);
    this.state = {
      selected: false,
    };
  }

  onPress = () => {
    const { onPress, data } = this.props;
    if (typeof onPress === 'function' && data.status === '2') onPress(data);
  };

  toggleDetail = () => {
    this.setState({ selected: !this.state.selected });
  };

  signIn = () => {
    const { signIn, data } = this.props;
    if (typeof signIn === 'function') signIn(data);
  };

  render() {
    const { data, style, noCard } = this.props;
    const { selected } = this.state;
    const {
      clinicDate,
      clinicTime,
      shiftName,
      clinicTypeName,
      docName,
      docJobTitle,
      depName,
      portrait,
      address,
      num,
      totalFee,
      status,
      proNo,
      proName,
      idNo,
      mobile,
    } = data;
    const statusName = getStatusName(status);
    const weekday = `周${'日一二三四五六'.charAt(moment(clinicDate, 'YYYY-MM-DD').day())}`;
    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;

    return (
      <TouchableOpacity style={[styles.container, style]} onPress={this.onPress}>
        <View style={styles.header}>
          <Portrait width={30} height={30} radius={15} bgColor={Global.colors.IOS_LIGHT_GRAY} imageSource={imageSource} />
          <ViewText text={docName} textStyle={{ marginLeft: 10, fontSize: 14 }} />
          <ViewText text={docJobTitle} textStyle={{ marginLeft: 10, fontSize: 11 }} />
          {
            status === '1' ? (
              noCard ?
                <View style={styles.status}>
                  <ViewText text="无卡预约请在医院现场签到" style={styles.statusView} textStyle={styles.statusText} />
                </View>
                :
                <View style={styles.status}>
                  <TouchableOpacity style={styles.button} onPress={this.signIn}>
                    <Text style={styles.buttonText}>现在签到</Text>
                  </TouchableOpacity>
                </View>
            ) :
                <View style={styles.status}>
                  <ViewText text={statusName} style={styles.statusView} textStyle={styles.statusText} />
                </View>
          }
          <TouchableOpacity onPress={this.toggleDetail}>
            <Icon
              name={selected ? 'ios-arrow-up' : 'ios-arrow-down'}
              size={20}
              color={Global.colors.IOS_ARROW}
              style={{ flex: 0, marginRight: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>科室</Text>
          <Text style={styles.contentText}>{depName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>时间</Text>
          <Text style={[styles.contentText, styles.orange]}>{clinicDate}  {weekday}  {shiftName}  {clinicTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>类型</Text>
          <Text style={styles.contentText}>{clinicTypeName}</Text>
        </View>
        {
          selected ?
          (
            <View>
              <View style={styles.row}>
                <Text style={styles.labelText}>位置</Text>
                <Text style={styles.contentText}>{address}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>序号</Text>
                <Text style={styles.contentText}>{num}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>费用</Text>
                <Text style={styles.contentText}>{totalFee}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>姓名</Text>
                <Text style={styles.contentText}>{proName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>手机号</Text>
                <Text style={styles.contentText}>{mobile}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>身份证号</Text>
                <Text style={styles.contentText}>{idNo}</Text>
              </View>
              {
                noCard ?
                  null :
                  <View style={styles.row}>
                    <Text style={styles.labelText}>卡号</Text>
                    <Text style={styles.contentText}>{proNo}</Text>
                  </View>
              }
            </View>
          ) :
          null
        }

      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 13,
    color: Global.colors.FONT_GRAY,
    width: 65,
  },
  contentText: {
    fontSize: 13,
  },
  orange: {
    color: Global.colors.ORANGE,
  },
  button: {
    width: 70,
    height: 25,
    backgroundColor: 'transparent',
    borderWidth: Global.lineWidth,
    borderColor: Global.colors.IOS_BLUE,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 11,
    color: Global.colors.IOS_BLUE,
  },
  statusView: {
    width: 70,
    height: 25,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    color: Global.colors.FONT_GRAY,
  },
  status: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});
