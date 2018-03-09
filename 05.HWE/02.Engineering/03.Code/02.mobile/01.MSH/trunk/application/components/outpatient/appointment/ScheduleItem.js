import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Portrait from 'rn-easy-portrait';
import Global from '../../../Global';
import { base } from '../../../services/RequestTypes';

export default class ScheduleItem extends PureComponent {
  onPress = () => {
    const { onPress, data } = this.props;
    if (typeof onPress === 'function') onPress(data);
  };

  render() {
    const {
      clinicDate, shiftName, clinicTypeName, docName, docJobTitle, totalFee, enableNum, address, portrait,
    } = this.props.data;
    const imageSource = portrait ? { uri: base().img + portrait } : Global.Config.defaultImgs.docPortrait;
    const endColor = enableNum > 0 ? Global.colors.IOS_BLUE : Global.colors.IOS_LIGHT_GRAY;

    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <Portrait
          width={50}
          height={50}
          radius={25}
          bgColor={Global.colors.IOS_GRAY_BG}
          imageSource={imageSource}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.grayText}><Text style={styles.nameText}>{docName}</Text> {docJobTitle}</Text>
          <Text style={styles.grayText}>{`${address}`}</Text>
          <Text style={styles.grayText}>
            {`${clinicDate} ${shiftName} ${clinicTypeName} `}
            <Text style={{ fontSize: 12, color: Global.colors.ORANGE }}>{`${totalFee}元`}</Text>
          </Text>
        </View>
        <View style={[styles.endContainer, { borderColor: endColor }]}>
          <View style={[styles.endHeader, Global.styles.CENTER, { backgroundColor: endColor }]}>
            <Text style={{ fontSize: 12, color: 'white' }}>剩余</Text>
          </View>
          <View style={[styles.endFooter, Global.styles.CENTER]} >
            <Text style={{ fontSize: 15, color: endColor }}>{`${enableNum}`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  contentContainer: {
    marginLeft: 10,
    flex: 1,
    height: 50,
    justifyContent: 'space-between',
  },
  endContainer: {
    borderRadius: 5,
    borderWidth: 1,
    width: 45,
    height: 45,
  },
  endHeader: {
    flex: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  endFooter: {
    flex: 5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: 'white',
  },
  grayText: {
    fontSize: 12,
    color: Global.colors.FONT_GRAY,
  },
  nameText: {
    fontSize: 14,
    color: Global.colors.FONT,
  },
});
