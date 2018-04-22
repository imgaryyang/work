import React, { Component } from 'react';
import { connect } from 'dva';

// import CompanySearchInput from '../../components/searchInput/CompanySearchInput';
import StatisticsChart from './charts/StatisticsChart';
import icon from '../../assets/image/icons/base-64.png';

class BaseHome extends Component {
  render() {
    const { wsHeight } = this.props.base;
    return (
    <div>
      <StatisticsChart />
      
      </div>
    );
  }
}

export default connect(
  ({ base }) => ({ base }),
)(BaseHome);
