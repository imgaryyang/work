import React from 'react';
import PropTypes from 'prop-types';
import styles from './CustomIcon.less';

class Icon extends React.Component {
  render() {
    const { type, color } = this.props;
    console.info(styles['icon']);
    const s_icon = `${styles['icon']} `;
    const s_iconfont = `${styles['iconfont']} `;
    const s_type = `${styles[`icon-${type}`]} `;
    const cls = s_icon + s_iconfont + s_type;
    return (
      <i className={cls} style={{ color }} />
    );
  }
}
Icon.propTypes = {
  type: PropTypes.string.isRequired,
};
export default Icon;
