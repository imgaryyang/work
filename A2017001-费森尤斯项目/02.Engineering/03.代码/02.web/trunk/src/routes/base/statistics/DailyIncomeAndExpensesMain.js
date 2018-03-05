
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './DailyIncomeAndExpensesSearchBar';
import List from './DailyIncomeAndExpensesList';

class DailyIncomeAndExpensesMain extends Component {

  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'financeStatistics/loadDailyIncomeAndExpenses',
      payload: {
        query: { dateRange: [moment(), moment()], chanel: params.chanel },
      },
    });
    this.props.dispatch({
      type: 'financeStatistics/loadHospitalList',
    });
  }

  render() {
    const { incomeAndExpensesSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={incomeAndExpensesSpin}>
        <div style={{ height: `${wsHeight - 2}px`, overflow: 'hidden' }} >
          <SearchBar />
          <List />
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(DailyIncomeAndExpensesMain);
