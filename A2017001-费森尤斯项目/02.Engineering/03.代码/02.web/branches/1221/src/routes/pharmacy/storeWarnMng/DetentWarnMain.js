import { connect } from 'dva';
import React from 'react';

import DetentWarnInfoList from './DetentWarnInfoList';

class DetentWarnMain extends React.Component {

  render() {
    return (
      <div>
        <DetentWarnInfoList />
      </div>
    );
  }
}
export default connect()(DetentWarnMain);
