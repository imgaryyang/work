import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import moment from 'moment';
import Portrait from 'rn-easy-portrait';
import Global from '../../../Global';
import ViewText from '../../../modules/ViewText';
import { base } from '../../../services/RequestTypes';

export default class AppointInfo extends PureComponent {
  onPress = () => {
    this.props.onPress(this.props.data);
  };

  render() {
    const {
      clinicDate,
      clinicTime,
      shiftName,
      clinicTypeName,
      docName,
      docJobTitle,
      hosName,
      depName,
      totalFee,
      address,
      portrait,
      num,
    } = this.props.data;

    const { style } = this.props;
    const weekday = `周${'日一二三四五六'.charAt(moment(clinicDate, 'YYYY-MM-DD').day())}`;

    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Portrait width={30} height={30} radius={15} bgColor={Global.colors.IOS_GRAY_BG} imageSource={imageSource} />
          <ViewText text={docName} textStyle={{ marginLeft: 10, fontSize: 15 }} />
          <ViewText text={docJobTitle} textStyle={{ marginLeft: 10, fontSize: 12 }} />
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>医院</Text>
          <Text style={styles.contentText}>{hosName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>科室</Text>
          <Text style={styles.contentText}>{depName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>位置</Text>
          <Text style={styles.contentText}>{address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>时间</Text>
          <Text style={styles.contentText}>{clinicDate}  {weekday}  {shiftName}  {clinicTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>类型</Text>
          <Text style={styles.contentText}>{clinicTypeName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>序号</Text>
          <Text style={styles.contentText}>{num}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>费用</Text>
          <Text style={[styles.contentText, styles.orange]}>{totalFee}</Text>
        </View>
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
    fontSize: 15,
    color: Global.colors.FONT_GRAY,
  },
  contentText: {
    fontSize: 15,
    marginLeft: 10,
  },
  orange: {
    color: Global.colors.ORANGE,
  },
});
