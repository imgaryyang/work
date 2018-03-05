import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';

import Global from '../../Global';

export default class Tools extends Component {
  static itemWidth = (Global.getScreen().width - 4) / 4;
  static iconWidth = Global.getScreen().width / 7;

  constructor(props) {
    super(props);
    this.onPressItem = this.onPressItem.bind(this);
  }

  onPressItem(component, title) {
    if (component !== null) {
      this.props.navigate({
        component,
        params: {
          title,
        },
      });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const { tools } = Global.Config.services;
    const mainServices = _.dropRight(tools[0].children, tools[0].children.length - 4);
    return mainServices.map(({
      id, name, iconLib, icon, route, bgColor
    }) => {
      // const bgColor = idx >= 6 ? this.bgColors[idx % 6] : this.bgColors[idx];
      const content = (
        <View style={styles.item} >
          <View style={[styles.iconContainer]} >
            <Icon iconLib={iconLib} name={icon} size={25} width={Tools.iconWidth} height={Tools.iconWidth} color="#ffffff" bgColor={bgColor} radius={Tools.iconWidth / 2} />
          </View>
          <Text style={[styles.text]}>{name}</Text>
        </View>
      );
      return (
        <TouchableOpacity
          key={id}
          style={styles.itemContainer}
          onPress={() => {
            this.onPressItem(route, name);
          }}
        >
          {content}
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.menu} >
          {this.renderMenu()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  itemContainer: {
    width: Tools.itemWidth,
  },
  item: {
    width: Tools.itemWidth,
    height: Tools.itemWidth + 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: Tools.iconWidth,
    height: Tools.iconWidth,
    // borderWidth: 1 / Global.pixelRatio,
    // borderRadius: Tools.iconWidth / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    width: Tools.iconWidth / 2,
    height: Tools.iconWidth / 2,
    backgroundColor: 'transparent',
    tintColor: Global.colors.FONT_GRAY,
  },
  text: {
    width: Tools.itemWidth - 10,
    fontSize: 13,
    textAlign: 'center',
    overflow: 'hidden',
    marginTop: 0,
    color: '#000000',
    fontWeight: '500',
  },

});
