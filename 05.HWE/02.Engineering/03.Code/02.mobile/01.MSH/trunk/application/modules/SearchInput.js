import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'rn-easy-icon';

import Global from '../Global';

class SearchInput extends Component {
  static displayName = 'SearchInput';
  static description = '搜索框组件';

  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
  }

  state = {
    value: this.props.value,
    buttonPos: new Animated.Value(-66),
    paddingRight: new Animated.Value(5),
  }

  /**
   * 组件接收参数变化
   */
  componentWillReceiveProps(/* props*/) {
    // this.setState(props);
  }

  onChangeText(value) {
    this.setState({ value }, () => {
      this.props.onChangeText(this.state.value);
      // this.toggleButton();
    });
  }

  toggleButton(visible) {
    // const posTo = this.state.value ? 5 : -66;
    // const paddingTo = this.state.value ? 65 : 0;
    const posTo = visible ? 5 : -66;
    const paddingTo = visible ? 65 : 0;
    Animated.parallel([
      Animated.spring(this.state.buttonPos, {
        toValue: posTo,
        duration: 150,
        // useNativeDriver: true,
      }),
      Animated.timing(this.state.paddingRight, {
        toValue: paddingTo,
        duration: 100,
        // useNativeDriver: true,
      }),
    ]).start();
  }

  render() {
    const { style, onSearch } = this.props;
    return (
      <Animated.View style={[styles.searchInputContainer, style, { paddingRight: this.state.paddingRight }]}>
        <Icon name="ios-search-outline" size={16} color={Global.colors.FONT_LIGHT_GRAY1} width={30} height={30} />
        <TextInput
          style={[styles.searchInput]}
          placeholder={this.props.placeholder || '请输入查询条件'}
          value={this.state.value}
          onChangeText={this.onChangeText}
          underlineColorAndroid="transparent"
          onFocus={() => this.toggleButton(true)}
          onBlur={() => this.toggleButton(false)}
        />
        <TouchableOpacity
          style={[Global.styles.CENTER, styles.clearBtn]}
          onPress={() => {
            this.onChangeText(null);
          }}
        >
          <Icon
            name="ios-close"
            size={20}
            width={20}
            height={20}
            color={Global.colors.FONT_LIGHT_GRAY1}
          />
        </TouchableOpacity>
        <Animated.View style={[styles.searchBtn, { right: this.state.buttonPos }]} >
          <TouchableOpacity
            style={styles.searchTouch}
            onPress={() => {
              onSearch(this.state.value);
            }}
          >
            <Text style={styles.searchText} >查询</Text>
            <Icon
              name="md-arrow-round-forward"
              size={14}
              width={24}
              height={20}
              color="white"
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  searchInputContainer: {
    height: 30,
    borderRadius: 6,
    // borderWidth: 1 / Global.pixelRatio,
    // borderColor: Global.colors.IOS_NAV_LINE,
    backgroundColor: '#efeeee',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    marginLeft: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 13,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
    height: 30,
  },
  clearBtn: {
    width: 40,
    height: 30,
    paddingRight: 15,
    paddingTop: Global.os === 'ios' ? 2 : 0,
  },
  clearIcon: {
  },
  searchBtn: {
    position: 'absolute',
    top: 5,
    overflow: 'hidden',
    width: 60,
    height: 20,
    borderRadius: 3,
    backgroundColor: '#A90015', // '#dedede',
  },
  searchTouch: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: 'white', // Global.colors.IOS_BLUE,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
});

SearchInput.propTypes = {

  /**
   * 初始值
   */
  value: PropTypes.string,

  /**
   * onChangeText回调函数
   */
  onChangeText: PropTypes.func,

  /**
   * onSearch回调函数
   */
  onSearch: PropTypes.func,

  /**
   * 样式
   */
  style: PropTypes.object,

};

SearchInput.defaultProps = {
  value: '',
  onChangeText: () => {},
  onSearch: () => {},
  style: {},
};

export default SearchInput;
