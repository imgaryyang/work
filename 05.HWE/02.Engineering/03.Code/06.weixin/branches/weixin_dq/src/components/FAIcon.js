import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './FALessMini/font-awesome.less';

class Icon extends React.Component {
  render() {
    const { type, color, style, className } = this.props;
    // console.log('fa less:', styles);
    // console.info(type);
    const cls = classnames(styles.fa, styles[`fa-${type}`], className || '');
    // console.log(cls);
    const colorStyle = color ? { color } : {};
    const finalStyle = { ...colorStyle, ...style };
    return (
      <i className={cls} style={finalStyle} />
    );
  }
}

Icon.propTypes = {
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

Icon.defaultProps = {
  color: null,
  style: {},
  className: '',
};

export default Icon;
