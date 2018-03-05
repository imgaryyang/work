import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import _ from 'lodash';

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
     * 获得焦点时回调
     */
    onFocus: PropTypes.func,

    /**
     * 显示的数据源
     */
    options: PropTypes.array,

    /**
     * 载入状态
     */
    fetching: PropTypes.bool,

    /**
     * 选项
     */
    optionRender: PropTypes.func,

    /**
     * 选择后显示值显示回调方法，如果不特殊指定，则默认使用 option.id
     */
    valueRender: PropTypes.func,

    /**
     * 下拉框大小 - 默认 large
     */
    size: PropTypes.string,

    /**
     * 下拉区样式表
     */
    // dropdownClassName: PropTypes.string,

    /**
     * 下拉区样式
     */
    // dropdownStyle: PropTypes.object,

  };

  static defaultProps = {
    // data: [],
    fetching: false,
    size: 'large',
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  state = {
    value: null,
    // innerSetValue: false,
  };

  componentWillMount() {
    this.setState({
      value: this.props.value,
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value !== this.state.value) {
      /* console.log('newProps.value:', newProps.value);
      console.log('newProps.defaultValue:', newProps.defaultValue);*/
      this.setState({
        value: newProps.value, // this.state.innerSetValue ? this.state.value : newProps.value,
        // innerSetValue: false,
      });
    }
  }

  onSelect(value, option) {
    // 回调onSelect
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(option.props.originData);
    }

    // console.log('SearchInput.onSelect() value, option:', value, option);
    // 选择后回显的值
    let displayValue = option.props.originData.id;
    if (typeof this.props.valueRender === 'function') displayValue = this.props.valueRender(option.props.originData);
    // console.log('displayValue:', displayValue);
    this.setState({
      value: displayValue,
      // innerSetValue: true,
    });
  }

  onSearch(input) {
    // console.log('SearchInput.onSearch() input:', input);
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(input);
    }
  }

  onFocus() {
    // console.log('SearchInput.onFocus():', 'focus');
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus();
    }
  }

  render() {
    const { options, fetching, optionRender, valueRender, size } = this.props;
    const rest = _.omit(this.props, [
      'options',
      'fetching',
      'optionRender',
      'valueRender',
      'dropdownMatchSelectWidth',
      'filterOption',
      'notFoundContent',
      'onSearch',
      'onSelect',
      'onFocus',
      'showSearch',
      'value',
    ]);

    const selectOptions = options.map((option, idx) => {
      return (
        <Option
          key={`${idx}_${getRandomNum(10)}`}
          value={typeof valueRender === 'function' ? valueRender(option) : option.id}
          originData={option}
          // title={option.companyName}
          className={`${styles.option} ${idx === options.length - 1 ? styles.borderBottom : ''}`}
        >
          {optionRender(option)}
        </Option>
      );
    });
    // console.log(selectOptions);

    return (
      <Select
        showSearch
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        dropdownMatchSelectWidth={false}
        size={size}
        value={this.state.value}
        optionLabelProp="value"
        allowClear
        {...rest}
      >{selectOptions}</Select>
    );
  }
}

export default connect(
)(SearchInput);

/* dropdownStyle={dropdownStyle}
dropdownClassName={dropdownClassName}
placeholder={placeholder}
style={style}
className={className} */
