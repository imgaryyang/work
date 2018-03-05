import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './SearchBar';
import List from './CompanyList';
import Editor from './CompanyEditor';

class CompanyMain extends Component {
  render() {
    const { isSpin } = this.props.company;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={isSpin}>
        <div style={{ height: `${wsHeight - 2}px`, overflow: 'hidden' }} >
          <SearchBar />
          <List />
        </div>
        <Editor />
      </Spin>
    );
  }
}

export default connect(
  ({ company, base }) => ({ company, base }),
)(CompanyMain);
