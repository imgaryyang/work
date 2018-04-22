import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  // Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import SwipeOut from 'react-native-swipeout';
import Icon from 'rn-easy-icon';
import Global from '../Global';
import Checkbox from './Checkbox';

class Item extends PureComponent {
  state = {
    leftPos: typeof this.props.selected !== 'undefined' ? -50 : 0, // new Animated.Value(-50),
  };

  componentWillReceiveProps(nextProps) {
    if (typeof this.props.selected !== 'undefined' && this.props.showChooseButton !== nextProps.showChooseButton) {
      if (nextProps.showChooseButton) this.setState({ leftPos: 0 }); // this.showChooseButton();
      else this.setState({ leftPos: -50 }); // this.hideChooseButton();
    }
  }

  // 行点击触发事件
  onPress = () => {
    if (typeof this.props.onPress === 'function') {
      this.props.onPress(this.props.data, this.props.index);
    }
  };

  // TODO: 动画与 react-native-swipeout 组件冲突，待解决，暂用无动画方案
  // showChooseButton() {
  //   Animated.timing(
  //     this.state.leftPos,
  //     {
  //       toValue: 0,
  //       duration: 100,
  //     },
  //   ).start();
  // }
  //
  // hideChooseButton() {
  //   Animated.timing(
  //     this.state.leftPos,
  //     {
  //       toValue: -50,
  //       duration: 100,
  //     },
  //   ).start();
  // }

  render() {
    // 右侧箭头
    const chevron = this.props.chevron ? (
      <Icon
        iconLib="fa"
        name="angle-right"
        size={20}
        width={40}
        height={25}
        color="rgba(199,199,204,1)"
      />
    ) : null;
    // 容器样式
    const baseContainer = {
      flexDirection: 'row',
      padding: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: Global.getScreen().width - this.state.leftPos,
    };
    let containerStyle = { ...baseContainer, ...this.props.style };
    // 如果自动加上箭头，则右侧统一不设定内边距
    if (this.props.chevron) containerStyle = { ...containerStyle, paddingRight: 0 };
    // 多选框
    const checkbox = typeof this.props.selected !== 'undefined' ? (
      <View style={styles.chooseBtnContainer} >
        <Checkbox
          checked={this.props.selected}
          onPress={() => {
            if (typeof this.props.onSelect === 'function') this.props.onSelect();
          }}
        />
      </View>
    ) : null;
    // console.log(this.state.leftPos);
    const content = (
      <View style={{ width: Global.getScreen().width, overflow: 'hidden' }} >
        <TouchableOpacity
          onPress={this.onPress}
          style={[containerStyle, { left: this.state.leftPos }]}
        >
          {checkbox}
          <View style={[styles.innerContainer, this.props.contentStyle]} >
            {this.props.children}
          </View>
          {chevron}
        </TouchableOpacity>
      </View>
    );
    if (this.props.swipeoutButtons.length === 0) {
      return (
        <View style={styles.wrappedContainer} >
          {content}
        </View>
      );
    } else {
      return (
        <SwipeOut
          style={styles.wrappedContainer}
          autoClose
          buttonWidth={50}
          right={this.props.swipeoutButtons}
          {...this.props.swipeoutConfig}
        >
          {content}
        </SwipeOut>
      );
    }
  }
}

const styles = StyleSheet.create({
  wrappedContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseBtnContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Item.propTypes = {
  /**
   * 行右侧箭头
   */
  chevron: PropTypes.bool,

  /**
   * 滑动操作的按钮
   */
  swipeoutButtons: PropTypes.array,

  /**
   * 滑动操作的配置属性，见 react-native-swipeout 官网说明
   */
  swipeoutConfig: PropTypes.object,

  /**
   * 点击行回调
   */
  onPress: PropTypes.func,

  /**
   * 行数据
   */
  data: PropTypes.object.isRequired,

  /**
   * 行序列
   */
  index: PropTypes.number.isRequired,

  /**
   * 内容部分使用的样式
   */
  contentStyle: PropTypes.object,
};

Item.defaultProps = {
  chevron: true,
  swipeoutButtons: [],
  swipeoutConfig: {},
  onPress: () => {},
  contentStyle: {},
};

export default Item;
