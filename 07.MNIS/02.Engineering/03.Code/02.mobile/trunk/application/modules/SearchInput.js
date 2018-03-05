import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
// import PropTypes from 'prop-types';
import Icon from 'rn-easy-icon';
import IonIcon from 'react-native-vector-icons/Ionicons';

import Global from '../Global';

class SearchInput extends Component {
  static displayName = 'SearchInput';
  static description = '搜索框组件';

  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
  }

  state = {
    value: this.props.value,
  }

  /**
   * 组件接收参数变化
   */
  componentWillReceiveProps(props) {
    this.setState(props);
  }

  onChangeText(value) {
    this.setState({ value }, () => {
      if (typeof this.props.onChangeText === 'function') { this.props.onChangeText(this.state.value); }
    });
  }

  render() {
    return (
      <View style={[styles.searchInputHolder, this.props.style]}>
        <Icon name="ios-search-outline" size={16} color={Global.colors.IOS_GRAY_FONT} width={30} height={30} />
        <TextInput
          style={[styles.searchInput]}
          placeholder="请输入查询条件"
          value={this.state.value}
          onChangeText={this.onChangeText}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          style={[Global.styles.CENTER, { width: 30 }]}
          onPress={() => {
          this.onChangeText(null);
        }}
        >
          <IonIcon
            name="ios-close"
            size={16}
            color={Global.colors.IOS_GRAY_FONT}
            style={[Global.styles.ICON, styles.clearIcon]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchInputHolder: {
    height: 30,
    borderRadius: 5,
    borderWidth: 1 / Global.pixelRatio,
    borderColor: Global.colors.IOS_NAV_LINE,
    backgroundColor: '#F8F8F8',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  clearIcon: {},
});

// SearchInput.propTypes = {
//
//   /**
//    * 初始值
//    */
//   value: PropTypes.string,
//
//   /**
//    * onChangeText回调函数
//    */
//   onChangeText: PropTypes.func,
//
//   /**
//    * 样式
//    */
//   style: PropTypes.object,
//
// };

export default SearchInput;