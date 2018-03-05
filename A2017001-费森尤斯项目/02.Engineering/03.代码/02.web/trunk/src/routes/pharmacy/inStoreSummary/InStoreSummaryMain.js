import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import SearchBar from './InStoreSummarySearchBar';
import List from './InStoreSummaryList';
import styles from './InStoreSummary.less';

class InStoreSummaryMain extends Component {
  render() {
    const { dispatch } = this.props;
    const { data, page, isSpin, searchObjs, cost, amount } = this.props.inStoreSummary;
    const { dicts } = this.props.utils;
    const { wsHeight } = this.props.base;
    const leftHeight = wsHeight - (95);
    const searchBarProps = {
      dicts,
      cost,
      amount,
      searchObjs,
      dispatch,
    };

    const listProps = {
      data,
      page,
      dicts,
      wsHeight,
      dispatch,
    };

    return (
      <Spin spinning={isSpin}>
        <SearchBar {...searchBarProps} />
        <Card className={styles.bottomCard} style={{ height: leftHeight }}>
          <List {...listProps} />
        </Card>
      </Spin>
    );
  }
}

export default connect(({ inStoreSummary, utils, base }) => ({ inStoreSummary, utils, base }))(InStoreSummaryMain);
