import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import { getRandomNum } from '../../utils/randomTool';

import styles from './SearchInput.less';

const Option = Select.Option;

class SearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

    /**
     * 输入时回调
     */
    onSearch: PropTypes.func,

    /**
     * 显示数据
     */
    options: PropTypes.array,

    /**
     * 选项
     */
    optionRender: PropTypes.func,

    /**
     * 下拉区样式表
     */
    dropdownClassName: PropTypes.string,

    /**
     * 下拉区样式
     */
    dropdownStyle: PropTypes.object,

    /**
     * 载入状态
     */
    fetching: PropTypes.bool,

    /**
     * 选择后显示值显示回调方法，如果不特殊指定，则默认使用 option.id
     */
    valueRender: PropTypes.func,

  };

  static defaultProps = {
    data: [],
    fetching: false,
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  state = {
    value: null,
  };

  componentWillMount() {
    this.setState({ value: this.props.value });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value) {
      this.setState({ value: newProps.value });
    }
  }

  onSelect(value, option) {
    // console.log('SearchInput.onSelect() value, option:', value, option);

    // 选择后回显的值
    let displayValue = option.props.originData.id;
    if (typeof this.props.valueRender === 'function') displayValue = this.props.valueRender(option.props.originData);
    this.setState({ value: displayValue });

    // 回调onSelect
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(option.props.originData);
    }
  }

  onSearch(input) {
    // console.log('SearchInput.onSearch() input:', input);
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(input);
    }
  }

  render() {
    const {
      options,
      optionRender,
      dropdownClassName,
      dropdownStyle,
      fetching,
      placeholder,
    } = this.props;

    return (
      <Select
        showSearch
        value={this.state.value}
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        dropdownMatchSelectWidth={false}
        dropdownStyle={dropdownStyle}
        dropdownClassName={dropdownClassName}
        size="large"
        placeholder={placeholder}
      >
        {
          options.map((option, idx) => {
            return (
              <Option
                key={`${idx}_${getRandomNum(10)}`}
                originData={option}
                className={`${styles.option} ${idx === options.length - 1 ? styles.borderBottom : ''}`}
              >
                {optionRender(option)}
              </Option>
            );
          })
        }
      </Select>
    );
  }
}

export default connect(
)(SearchInput);

