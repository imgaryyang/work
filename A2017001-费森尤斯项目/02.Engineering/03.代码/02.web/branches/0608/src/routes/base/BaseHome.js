import React, { Component } from 'react';
import { connect } from 'dva';

// import CompanySearchInput from '../../components/searchInput/CompanySearchInput';

import icon from '../../assets/image/icons/base-64.png';

class BaseHome extends Component {
  render() {
    const { wsHeight } = this.props.base;
    return (
      <div style={{ height: `${wsHeight}px` }} className="home-div" >
        {/* <CompanySearchInput onSelect={item => console.log(item)} />*/}
        <div style={{ backgroundImage: `url(${icon})` }} >
          <span>请选择需要的操作</span>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ base }) => ({ base }),
)(BaseHome);
