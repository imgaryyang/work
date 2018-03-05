import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;

class AsyncDataSourceSelect extends Component {

  static propTypes = {
    /**
     * 要查询的数据源表名, 驼峰式命名, eg. 'companyInfo'
     */
    codeName: PropTypes.string.isRequired,
  };

  render() {
    const { codeName, utils } = this.props;
    const other = _.omit(this.props, ['codeName', 'dispatch', 'filterOption', 'showSearch', 'utils']);
    const dataSource = utils.dataSource[codeName] || {};
    const options = [];

    for (const key of Object.keys(dataSource)) {
      const item = dataSource[key];
      options.push(
        <Option key={key} value={key} originData={item} >
          {item.name}
        </Option>,
      );
    }

    return (
      <Select
        showSearch={false}
        {...other}
      >
        { options }
      </Select>
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(AsyncDataSourceSelect);
