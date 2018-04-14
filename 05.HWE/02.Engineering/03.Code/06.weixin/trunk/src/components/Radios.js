import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './Radios.less';
import { colors } from '../utils/common';
import Icon from './FAIcon';

export default class Radios extends PureComponent {
  render() {
    const { data, containerStyle, value, onSelect, flexItem } = this.props;
    if (data.length === 0) return <div className={styles.radiosContainer} style={containerStyle} />;

    return (
      <div className={styles.radiosContainer} style={containerStyle} >
        {data.map((item, idx) => {
          const iconName = item.value !== value ? 'circle-thin' : 'check-circle';
          const iconColor = item.value !== value ? colors.FONT_LIGHT_GRAY1 : colors.IOS_BLUE;
          return (
            <div
              key={idx}
              className={styles.radioContainer}
              onClick={() => onSelect({ value: item.value, label: item.label })}
              style={flexItem ? { flex: 1 } : {}}
            >
              <Icon type={iconName} style={{ color: iconColor }} className={styles.radioIcon} />
              <span className={styles.radioText}>{item.label}</span>
            </div>
          );
        })}
      </div>
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
  containerStyle: PropTypes.object,

  /**
   * 选中回调
   */
  onSelect: PropTypes.func,

  /**
   * 子元素是否弹性显示
   */
  flexItem: PropTypes.bool,
};

Radios.defaultProps = {
  data: [],
  value: '',
  containerStyle: {},
  onSelect: () => {},
  flexItem: false,
};
