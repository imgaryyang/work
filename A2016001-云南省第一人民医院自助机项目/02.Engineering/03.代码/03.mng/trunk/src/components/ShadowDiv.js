import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import styles from './ShadowDiv.less';

class ShadowDiv extends Component {

  static propTypes = {

    /**
     * body区样式
     */
    bodyStyle: PropTypes.object,

    /**
     * body区class
     */
    bodyClassName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),

    /**
     * 是否显示顶端阴影，默认为true
     */
    showTopShadow: PropTypes.bool,

    /**
     * 是否显示底端阴影，默认为true
     */
    showBottomShadow: PropTypes.bool,

  };

  static defaultProps = {
    showTopShadow: true,
    showBottomShadow: true,
  };

  render() {
    const { className, bodyStyle, bodyClassName,
      children, showTopShadow, showBottomShadow } = this.props;
    const other = _.omit(this.props, ['className', 'bodyStyle',
      'bodyClassName', 'dispatch', 'showTopShadow', 'showBottomShadow']);
    return (
      <div className={`${styles.shadowDiv} ${className || ''}`} {...other} >
        {
          showTopShadow ? (
            <span>
              <div className={styles.topShadow} />
              <div className={styles.topShadowMask} />
            </span>
          ) : null
        }
        <div className={bodyClassName} style={bodyStyle} >
          {children}
        </div>
        {
          showBottomShadow ? (
            <span>
              <div className={styles.bottomShadow} />
              <div className={styles.bottomShadowMask} />
            </span>
          ) : null
        }
      </div>
    );
  }
}

export default connect()(ShadowDiv);

