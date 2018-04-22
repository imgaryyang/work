import React from 'react';
import PropTypes from 'prop-types';
import styles from './CustomIcon.less';

class Icon extends React.Component {
  render() {
    const { type, color, style, className } = this.props;
    // console.log('ci less:', styles);
    // console.info(styles['icon']);
    const s_icon = `${styles['icon']} `;
    const s_iconfont = `${styles['iconfont']} `;
    const s_type = `${styles[`icon-${type}`]} `;
    const cls = s_icon + s_iconfont + s_type + className || '';
    const colorStyle = { color };
    const finalStyle = { ...colorStyle, ...style };
    return (
      <i className={cls} style={finalStyle} />
    );
  }
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
};

Icon.defaultProps = {
  style: {},
  className: '',
};

export default Icon;
