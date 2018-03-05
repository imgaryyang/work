import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class CompanySearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

    /**
     * 厂商分类：生产厂商/供应商
     * 传入类型数组，不传则显示所有
     * ['1'] - 显示生产厂商 ; ['2'] - 显示供应商 ; ['1', '2'] - 显示生产厂商及供应商
     */
    companyType: PropTypes.array,

    /**
     * 服务范围：药品/物资/资产
     * 传入类型数组，不传则显示所有
     * ['1'] - 药品 ; ['2'] - 物资 ; ['3'] - 资产 ; ['1', '2'] - 药品及物资 …… (以此类推)
     */
    services: PropTypes.array,

  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentWillMount() {
  // 修复从其它窗口返回浏览器时选择的值消失问题
    this.props.dispatch({
      type: 'utils/loadCompanies',
      payload: {
        searchCode: '',
        companyType: this.props.companyType,
        services: this.props.services,
      },
    });
  }

  onSelect(item) {
  // 修复第二次无法选择
  /*
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        companies: [],
      },
    });*/
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadCompanies',
      payload: {
        searchCode,
        companyType: this.props.companyType,
        services: this.props.services,
      },
    });
  }

  onFocus() {
    // console.log('onFocus in CompanySearchInput.');
  // 修复从其它窗口返回浏览器时选择的值消失问题
  /*
  this.props.dispatch({
        type: 'utils/loadCompanies',
        payload: {
          searchCode: '',
          companyType: this.props.companyType,
          services: this.props.services,
        },
      });
  */
  }

  render() {
    const { utils } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus', 'companyType', 'services']);
    const { companies, companiesFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.companies}`} >
        <span className={styles.companyName} >{option.companyName}</span>
      </div>
    );

    const companyOptions = companies.map(company => <Option key={company.id}>{company.name}</Option>);

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={companies}
        optionRender={optionRender}
        valueRender={option => `${option.companyName}`}
        fetching={companiesFetching}
        dropdownStyle={{ width: '200px' }}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(CompanySearchInput);

