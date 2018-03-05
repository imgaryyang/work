import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import Icon from 'rn-easy-icon';

import Global from '../../Global';

class AppFuncs extends Component {
  constructor(props) {
    super(props);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
  }

  onPressMenuItem(route, name, state) {
    if (route && state === '1') {
      this.props.navigate(route);
    } else {
      Toast.show(`${name}暂未开通`);
    }
  }

  /**
   * 渲染所有菜单项
   */
  renderMenu() {
    const { base, userRole, mainMenu } = this.props;
    const { orientation, screen } = base;
    const { width } = screen;
    if (!userRole) return null;
    return Global.getMenus()[userRole][mainMenu].map(({
      id, state, name, route, iconLib, icon, iconSize, iconSmallSize, /* img, */color, bgColor, devMode,
    }, idx) => {
      // 如果是生产模式，且菜单是开发模式菜单，则不显示
      if (Global.mode === Global.MODE_PRO && devMode === true) return null;

      const itemWidth = Global.device.isTablet() ? (orientation === Global.ORIENTATION_LANDSCAPE ? width / 5 : width / 4) - 0.5 : (width / 4) - 0.5;
      const itemHeight = Global.device.isTablet() ? 160 : 120;
      const iconWidth = Global.device.isTablet() ? 90 : 50;
      const iconHeight = Global.device.isTablet() ? 90 : 50;

      const content = (
        <View style={[styles.item, { width: itemWidth, height: itemHeight }]} >
          {/* <View style={[styles.iconContainer, { width: iconWidth, height: iconHeight, backgroundColor: bgColor }]} >
            <Icon iconLib={iconLib} name={icon} size={30} color={color} />
          </View>*/}
          <Icon iconLib={iconLib} name={icon} size={Global.device.isTablet() ? iconSize : iconSmallSize} color={color} width={iconWidth} height={iconHeight} radius={10} bgColor={bgColor} />
          <Text style={[styles.text, { width: itemWidth - 10 }]}>{name}</Text>
        </View>
      );
      return (
        <TouchableOpacity
          key={`${id}_${idx + 1}`}
          style={[styles.itemContainer, { width: itemWidth }]}
          onPress={() => {
            this.onPressMenuItem(route, name, state);
          }}
        >
          {content}
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={styles.menu} >
        {this.renderMenu()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
    borderBottomWidth: 1 / Global.pixelRatio,
    borderBottomColor: Global.colors.LINE,
  },

  itemContainer: {
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // iconContainer: {
  //   borderWidth: 1 / Global.pixelRatio,
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  icon: {
  },
  text: {
    // color: Global.colors.FONT_GRAY,
    fontSize: Global.device.isTablet() ? 17 : 12,
    textAlign: 'center',
    overflow: 'hidden',
    marginTop: Global.device.isTablet() ? 17 : 12,
  },
});

AppFuncs.propTypes = {
  /**
   * 当前登录人角色
   */
  userRole: PropTypes.string,

  /**
   * 主菜单 inpatientArea / sickbed
   */
  mainMenu: PropTypes.string.isRequired,
};

AppFuncs.defaultProps = {
  userRole: null,
};

const mapStateToProps = state => ({
  auth: state.auth,
  base: state.base,
});

export default connect(mapStateToProps)(AppFuncs);
