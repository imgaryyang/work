import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option = Select.Option;

class MachineSelect extends Component {

  static propTypes = {
  };

  render() {
    const { dispatch, filterOption, showSearch, machine, ...other } = this.props;
    const dictItems = machine.dicts;
    const options = [];
    for (let i = 0; dictItems && i < dictItems.length; i += 1) {
      const item = dictItems[i];
      options.push(
        <Option key={item.id} value={item.id} originData={item} >
          {item.name}
        </Option>,
      );
    }

    const defaultFilterOption = (input, option) => {
      return (option.props.originData.spellCode
          && option.props.originData.spellCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.wbCode
          && option.props.originData.wbCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || (option.props.originData.userCode
          && option.props.originData.userCode.toLowerCase().indexOf(input.toLowerCase()) >= 0)
        || option.props.children.indexOf(input) >= 0;
    }

    return (
      <Select
        showSearch={typeof showSearch === 'undefined' ? true : showSearch}
        filterOption={typeof filterOption === 'function' ? filterOption : defaultFilterOption}
        {...other}
      >
        { options }
      </Select>
    );
  }
}

export default connect(({ machine }) => ({ machine }))(MachineSelect);
