import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Icon from 'rn-easy-icon';

import Global from '../../Global';

export default class AppSubFuncs extends Component {
  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.props.navigation.setParams({
      title: params ? params.title || '功能选择' : '功能选择',
      showCurrHospitalAndPatient: true,
      allowSwitchHospital: true,
      allowSwitchPatient: true,
    });
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const { params } = this.props.navigation.state;
    // console.log(params);
    return params.children.map(({
      id, name, iconLib, icon, route, passProps, group,
    }, idx) => {
      if (group === true) {
        return (
          <View key={id} style={styles.borderBottom}>
            <Text style={styles.grpText}>{name}</Text>
          </View>
        );
      }
      const marginTop = idx === 0 && group !== true ? (
        <View style={{ height: 15 }} />
      ) : null;
      return (
        <TouchableOpacity
          key={id}
          onPress={() => {
            params.onPressMenuItem(route, name, passProps);
          }}
        >
          {marginTop}
          <View style={[styles.itemContainer, idx === 0 ? styles.borderTop : null]}>
            <View style={styles.imgContainer}>
              {/* <Image source={Global.Config.imgIcons[imgIcon]} resizeMode="contain" style={styles.icon} />*/}
              <Icon
                iconLib={iconLib}
                name={icon}
                size={14}
                width={14}
                height={14}
                color="white"
              />
            </View>
            <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
            <Icon
              iconLib="fa"
              name="angle-right"
              size={16}
              width={46}
              height={18}
              color="rgba(199,199,204,1)"
            />
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]}>
        {this.renderMenu()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  grpText: {
    fontSize: 14,
    color: Global.colors.FONT_GRAY,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  borderTop: {
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
  },
  borderBottom: {
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    paddingLeft: 15,
  },
  imgContainer: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: '#469ad8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
    tintColor: 'white',
  },
});
