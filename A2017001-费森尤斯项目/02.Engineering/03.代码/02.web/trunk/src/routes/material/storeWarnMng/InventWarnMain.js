import React, { Component } from 'react';
import { connect } from 'dva';

import InventWarnInfoList from './InventWarnInfoList';

class InventWarnMain extends Component {
  render() {
    return (
      <div>
        <InventWarnInfoList />
      </div>
    );
  }
}
export default connect()(InventWarnMain);
