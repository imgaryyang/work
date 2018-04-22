import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'rn-easy-icon';

import Global from '../../../Global';

import { TIMELINE_WIDTH } from '../OutpatientGuidance';

const icons = {
  register: { icon: 'md-calendar', bgColor: '#69DE51' },
  diagnosis: { icon: 'md-medkit', bgColor: '#F54D53' },
  cure: { icon: 'md-hand', bgColor: '#E4B74C' },
  order: { icon: 'md-card', bgColor: '#FAC412' },
  check: { icon: 'md-flask', bgColor: '#757BFC' },
  drug: { icon: 'md-filing', bgColor: '#38CDB5' },
  queue: { icon: 'md-list-box', bgColor: '#757BFC' },
};

export default class StepCat extends Component {
  render() {
    const marginLeft = TIMELINE_WIDTH - 15 - (1 / Global.pixelRatio);
    const { item } = this.props;
    return (
      <View style={styles.stepCat} >
        <View style={[styles.stepCatTitle, { marginLeft }]} >
          <View style={styles.iconContainer} >
            <Icon
              name={icons[item.bizType].icon}
              size={16}
              width={30}
              height={30}
              color="#ffffff"
              radius={15}
              bgColor={icons[item.bizType].bgColor}
            />
          </View>
          <Text style={styles.titleText} >{item.name}</Text>
        </View>
        <View style={styles.stepsHolder} >
          {this.props.children}
        </View>
        <View style={[styles.stepCatFoot]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stepCat: {
    marginTop: 16,
    marginBottom: 5,
  },
  stepCatTitle: {
    width: Global.getScreen().width - 100,
    // marginLeft: TIMELINE_WIDTH - 15 - (1 / Global.pixelRatio),
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 30,
    height: 30,
    // borderColor: '#eeeeee',
    // borderWidth: 2,
    borderRadius: 15,
    // backgroundColor: 'white',
    // padding: 2,
  },
  titleText: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    marginLeft: 10,
  },
  stepsHolder: {
    width: Global.getScreen().width,
  },
  stepCatFoot: {
    // height: 10,
  },
});
