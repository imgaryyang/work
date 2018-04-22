/**
 * 自定义导航栏
 */

import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, PixelRatio } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
// import Global from '../Global';

export const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
export const BACKBTN_WIDTH = 15 + 15 + 15;

export class BackButton extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <TouchableOpacity style={styles.backBtnContainer} onPress={() => { navigation.goBack(); }} >
        <Icon name="md-arrow-round-back" size={20} style={styles.backIcon} />
      </TouchableOpacity>
    );
  }
}

BackButton.propTypes = {
  /**
   * navigation
   */
  navigation: PropTypes.object.isRequired,
};

BackButton.defaultProps = {
};

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.renderBackBtn = this.renderBackBtn.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderRight = this.renderRight.bind(this);
  }

  renderBackBtn() {
    const { nav, navigation } = this.props;
    if (nav && nav.routes.length > 1) {
      return (
        <BackButton navigation={navigation} />
      );
    } else {
      return null;
    }
  }

  renderTitle() {
    const { state } = this.props.navigation;
    return (
      <Text style={styles.title} >{state.params ? state.params.title || '' : ''}</Text>
    );
  }

  renderRight() {
    const { state } = this.props.navigation;
    return state.params ? state.params.headerRight || null : null;
  }

  render() {
    const { bottom, bottomHeight, fixedRight, containerStyle, content, nav, hideBottomLine/* , hideShadow*/ } = this.props;
    // console.log(nav, navigation, navigationOptions);
    const containerHeight = NAVBAR_HEIGHT + (bottomHeight);
    const bottomLineStyle = hideBottomLine ? { borderBottomWidth: 0 } : null;
    return (
      <SafeAreaView
        style={[
          styles.container,
          // !hideShadow ? styles.containerShadow : null,
          styles.bottomLine,
          { height: containerHeight },
          bottomLineStyle,
          containerStyle,
        ]}
      >
        {
          content || (
            <View style={styles.mainView} >
              <View style={[styles.leftContainer, { width: nav && nav.routes.length > 1 ? BACKBTN_WIDTH : 15 }]} >
                {this.renderBackBtn()}
              </View>
              <View style={styles.centerContainer} >
                {this.renderTitle()}
              </View>
              <View style={styles.rightContainer} >
                {this.renderRight()}
              </View>
              {fixedRight || null}
            </View>
          )
        }
        {bottomHeight > 0 && bottom ? bottom : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  containerShadow: {
    shadowColor: '#bbbbbb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  bottomLine: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#96969A', // '#E6E6E6',
  },
  mainView: {
    height: NAVBAR_HEIGHT,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  centerContainer: {
    flex: 1,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  rightContainer: {
    maxWidth: 200,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15,
    // backgroundColor: 'brown',
  },
  backBtnContainer: {
    width: BACKBTN_WIDTH,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 2,
    // paddingBottom: 2,
  },
  backIcon: {
    color: '#BBBBBB',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
});

NavigationBar.propTypes = {
  /**
   * 此属性将完全取代导航栏容器内所有子元素
   */
  content: PropTypes.node,

  /**
   * 导航栏容器样式
   */
  containerStyle: PropTypes.object,

  /**
   * navigation
   */
  navigation: PropTypes.object.isRequired,
  // screenProps: PropTypes.object.isRequired,

  /**
   * navigationOptions
   */
  // navigationOptions: PropTypes.object.isRequired,

  /**
   * 自定义底端线条样式
   */
  // bottomLineStyle: PropTypes.object,

  /**
   * 导航栏底端扩展组件
   */
  bottom: PropTypes.node,

  /**
   * 导航栏底端扩展高度，配合 bottom 使用，不指定高度底端高度为 0
   */
  bottomHeight: PropTypes.number,

  /**
   * 导航栏右端扩展组件
   */
  fixedRight: PropTypes.node,

  /**
   * 隐藏底端线条
   */
  hideBottomLine: PropTypes.bool,

  /**
   * 隐藏底端阴影
   */
  // hideShadow: PropTypes.bool,
};

NavigationBar.defaultProps = {
  content: null,
  containerStyle: null,
  bottom: null,
  bottomHeight: 0,
  fixedRight: null,
  // bottomLineStyle: null,
  hideBottomLine: false,
  // hideShadow: false,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(NavigationBar);
