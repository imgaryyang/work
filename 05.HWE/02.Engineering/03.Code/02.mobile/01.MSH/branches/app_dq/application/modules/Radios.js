import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'rn-easy-icon';
import Global from '../Global';

export default class Radios extends PureComponent {
  render() {
    const { data, value, onSelect, radiosContainerStyle, radioContainerStyle } = this.props;
    if (data.length === 0) return <View style={styles.radiosContainer} />;

    return (
      <View style={[styles.radiosContainer, radiosContainerStyle]}>
        {data.map((item) => {
          const iconName = item.value !== value ? 'ios-checkmark-circle-outline' : 'ios-checkmark-circle';
          const iconColor = item.value !== value ? 'rgba(130,130,130,1)' : 'rgba(255,102,0,1)';

          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.radioContainer, radioContainerStyle]}
              onPress={() => onSelect({ value: item.value, label: item.label })}
            >
              <Icon name={iconName} size={16} bgColor="transparent" width={25} color={iconColor} style={styles.radioIcon} />
              <Text style={styles.radioText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

Radios.propTypes = {
  /**
   * 标签数组
   */
  data: PropTypes.array,

  /**
   * 默认值
   */
  value: PropTypes.string,

  /**
   * 标签容器样式
   */
  radiosContainerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

  radioContainerStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),

  /**
   * 选中回调
   */
  onSelect: PropTypes.func,
};

Radios.defaultProps = {
  data: [],
  value: '',
  radiosContainerStyle: {},
  radioContainerStyle: {},
  onSelect: () => {},
};

const styles = StyleSheet.create({
  radiosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: Global.lineWidth,
    borderColor: Global.colors.IOS_LIGHT_GRAY,
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    borderRadius: 5,
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(248,248,248,1)',
  },
  radioIcon: {
    paddingRight: 6,
  },
  radioText: {
    fontSize: 13,
    color: 'black',
  },
});
