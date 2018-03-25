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
import Global from '../../../Global';
import ViewText from '../../../modules/ViewText';
import { base } from '../../../services/RequestTypes';

export default class AppointRecord extends PureComponent {
  constructor(props) {
    super(props);

    this.dialog = null;
    this.state = {
      selected: false,
    };
  }

  toggleDetail = () => {
    this.setState({ selected: !this.state.selected });
  };

  cancelAppoint = () => {
    const { onPress, data } = this.props;
    if (typeof onPress === 'function') onPress(data);
  };

  render() {
    const { data, style } = this.props;
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
      statusName,
    } = data;
    const weekday = `周${'日一二三四五六'.charAt(moment(clinicDate, 'YYYY-MM-DD').day())}`;
    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Portrait width={30} height={30} radius={15} bgColor={Global.colors.IOS_LIGHT_GRAY} imageSource={imageSource} />
          <ViewText text={docName} textStyle={{ marginLeft: 10, fontSize: 14 }} />
          <ViewText text={docJobTitle} textStyle={{ marginLeft: 10, fontSize: 11 }} />
          {
            status === '1' ?
              <View style={styles.status}>
                <TouchableOpacity style={styles.button} onPress={this.cancelAppoint}>
                  <Text style={styles.buttonText}>取消预约</Text>
                </TouchableOpacity>
              </View> :
              <View style={styles.status}>
                <ViewText
                  text={statusName}
                  style={styles.statusView}
                  textStyle={styles.statusText}
                />
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
            </View>
          ) :
          null
        }
      </View>
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
  },
  contentText: {
    fontSize: 13,
    marginLeft: 10,
  },
  orange: {
    color: Global.colors.ORANGE,
  },
  button: {
    // width: 82,
    // height: 27,
    width: 60,
    height: 20,
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
    // width: 82,
    // height: 27,
    width: 60,
    height: 20,
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
