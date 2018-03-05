/**
 * 健康工具
 */

import React, { Component } from 'react';
import {
  InteractionManager,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

// import { connect } from 'react-redux';
// import { NavigationActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import Icon from 'rn-easy-icon';
import Card from 'rn-easy-card';
import Sep from 'rn-easy-separator';

import Global from '../../Global';

class Tools extends Component {
  static displayName = 'Tools';
  static description = '健康工具';

  static primaryItemWidth = (Global.getScreen().width - 4) / 3;
  static primaryIconWidth = Global.getScreen().width / 7;

  /**
   * 渲染过渡场景
   * @returns {XML}
   */
  static renderPlaceholderView() {
    return (
      <View style={Global.styles.INDICATOR_CONTAINER} >
        <ActivityIndicator />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.onPressMenuItem = this.onPressMenuItem.bind(this);
  }

  state = {
    doRenderScene: false,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        doRenderScene: true,
      });
    });
    this.props.navigation.setParams({
      title: '健康工具箱',
    });
  }

  onPressMenuItem(component, title) {
    if (component !== null) {
      this.props.navigation.navigate(component, {
        title,
      });
    } else {
      Toast.show(`${title}即将开通`);
    }
  }

  // 渲染所有菜单
  renderMenu() {
    const { services } = Global.Config;
    return services.tools.map(({
      grpCode, grpName, children,
    }, grpIdx) => {
      const marginTop = grpIdx === 0 ? null : 15;
      const menus = children.map(({
        id, name, iconLib, icon, route,
      }, idx) => {
        return (
          <TouchableOpacity
            key={`${id}_${idx + 1}`}
            style={styles.primaryItemContainer}
            onPress={() => {
              this.onPressMenuItem(route, name);
            }}
          >
            <View style={[styles.primaryItem]} >
              <Icon iconLib={iconLib} name={icon} size={30} width={Tools.primaryIconWidth} height={Tools.primaryIconWidth} color={Global.colors.FONT_LIGHT_GRAY} />
              <Text style={[styles.primaryText]}>{name}</Text>
            </View>
          </TouchableOpacity>
        );
      });
      return (
        <Card key={`${grpCode}_${grpIdx + 1}`} fullWidth noPadding style={{ paddingBottom: 15, marginTop }} >
          <Text style={styles.grpTitle} >{grpName}</Text>
          <View style={styles.menu} >
            {menus}
          </View>
        </Card>
      );
    });
  }

  render() {
    // 场景过渡动画未完成前，先渲染过渡场景
    if (!this.state.doRenderScene) {
      return Tools.renderPlaceholderView();
    }

    return (
      <View style={[Global.styles.CONTAINER, { backgroundColor: Global.colors.IOS_GRAY_BG }]} >
        <ScrollView style={styles.scrollView} >
          {this.renderMenu()}
          <Sep height={15} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 25,
  },
  grpTitle: {
    flex: 1,
    fontSize: 16,
    padding: 15,
    paddingLeft: 20,
    color: '#000000',
  },

  menu: {
    // marginTop: Tools.topImgHeight,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderTopWidth: 1 / Global.pixelRatio,
    borderTopColor: Global.colors.LINE,
  },

  primaryItemContainer: {
    width: Tools.primaryItemWidth,
  },
  primaryItem: {
    width: Tools.primaryItemWidth,
    height: (Tools.primaryItemWidth * 4) / 5,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRightWidth: 1 / Global.pixelRatio,
    // borderRightColor: Global.colors.LINE,
    // borderBottomWidth: 1 / Global.pixelRatio,
    // borderBottomColor: Global.colors.LINE,
  },
  primaryText: {
    width: Tools.itemWidth - 10,
    fontSize: 14,
    textAlign: 'center',
    overflow: 'hidden',
    lineHeight: 20,
    color: '#000000',
    fontWeight: '500',
  },
});

Tools.navigationOptions = {
};

// const mapDispatchToProps = dispatch => ({
//   navigate: ({ component, params }) => dispatch(NavigationActions.navigate({ routeName: component, params })),
// });
//
// export default connect(null, mapDispatchToProps)(Tools);
export default Tools;
