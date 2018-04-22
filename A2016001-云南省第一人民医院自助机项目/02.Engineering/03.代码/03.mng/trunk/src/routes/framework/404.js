import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './404.less';
// import { Link } from 'dva/router';

function Error404() {
  return (
    <div className="content-inner">
      <div className={styles.error}>
        <Icon type="frown-o" className={styles.errorIcon} />
        <h1>404 Not Found</h1>
      </div>
    </div>
  );
}

Error404.propTypes = {};

export default connect()(Error404);
