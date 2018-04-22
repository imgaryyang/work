import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

function Error404() {
  return (
    <div style={{textAlign: 'center'}}>
      <h1 >功能还未实现，敬请期待！ </h1>
    </div>
  );
}

Error404.propTypes = {
};

export default connect()(Error404);
