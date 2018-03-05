import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';

import styles from './FieldSet.less';

class FieldSet extends Component {
  static propTypes = {
    /**
     * title
     */
    title: PropTypes.string.isRequired,
  };

  render() {
    const { title, children } = this.props;
    const other = _.omit(this.props, ['title', 'dispatch', 'children']);
    return (
      <div {...other} >
        <div className={styles.fieldSet} >
          <div />
            <span>{title}</span>
        </div>
        {children}
      </div>
    );
  }
}

export default connect()(FieldSet);

