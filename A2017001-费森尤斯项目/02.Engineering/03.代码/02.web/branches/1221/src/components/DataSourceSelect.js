import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;

class DataSourceSelect extends Component {

  static propTypes = {
    /**
     * 要查询的数据源表名, 驼峰式命名, eg. 'companyInfo'
     */
    codeName: PropTypes.string.isRequired,
  };

  render() {
    const { codeName, filterOption, showSearch, utils } = this.props;
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

    const defaultFilterOption = (input, option) => {
      return ((option.props.originData.pyCode
          && option.props.originData.pyCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.wbCode
          && option.props.originData.wbCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || option.props.children.indexOf(input) >= 0);
    };

    return (
      <Select
        showSearch={typeof showSearch === 'undefined' ? true : showSearch}
        filterOption={typeof filterOption === 'function' ? filterOption : defaultFilterOption}
        {...other}   allowClear="true"
      >
        { options }
      </Select>
    );
  }
}

export default connect(({ utils }) => ({ utils }))(DataSourceSelect);
