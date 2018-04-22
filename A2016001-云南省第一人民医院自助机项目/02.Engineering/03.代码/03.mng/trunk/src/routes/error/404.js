import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

function Error404() {
  return (
    <div >
      <h1 >404 not found </h1>
    </div>
  );
}

Error404.propTypes = {
};

export default connect()(Error404);
