import React, { Component } from 'react';
import { connect } from 'dva';

// import CompanySearchInput from '../../components/searchInput/CompanySearchInput';

import icon from '../../assets/image/icons/base-64.png';

class BaseHome extends Component {
  render() {
    const { wsHeight } = this.props.base;
    return (
      /*<div style={{ height: `${wsHeight}px` }} className="home-div" >
        { <CompanySearchInput onSelect={item => console.log(item)} />}
        <div style={{ backgroundImage: `url(${icon})` }} >
          <span>请选择需要的操作</span>
        </div>
      </div>*/
      <div style = {{textAlign:'left', width:'400px',margin:'auto', fontSize:'15px'}} >
	      <p>程序员甲：哎，借我点钱呗？</p>
	      <p>程序员乙：借多少？</p>
	      <p>程序员甲：1000。</p>
	      <p>程序员乙：行。哎，要不要多借你 24，好凑个整？</p>
	      <p>程序员甲：也好。</p>
       </div>
    );
  }
}

export default connect(
  ({ base }) => ({ base }),
)(BaseHome);
