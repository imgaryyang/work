import React, { Component } from 'react';
import { connect } from 'dva';

import icon from '../../assets/image/icons/hrp-64.png';

class HrpHome extends Component {
  render() {
    const { wsHeight } = this.props.base;
    return (
      <div style={{ height: `${wsHeight}px` }} className="home-div" >
        <div style={{ backgroundImage: `url(${icon})` }} >
          <span>请选择需要的操作</span>
        </div>
      </div>
    );
  }
}
export default connect(
  ({ base }) => ({ base }),
)(HrpHome);
