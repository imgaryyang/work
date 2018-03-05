
import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class MaterialCompanySearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

    /**
     * 厂商分类：生产厂商/供应商
     */
    companyType: PropTypes.string,

  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  onSelect(item) {
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        materialCompany: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadMaterialCompany',
      payload: {
        searchCode,
        companyType: this.props.companyType,
      },
    });
  }

  onFocus() {
    // console.log('onFocus in MaterialCompanySearchInput.');
    this.props.dispatch({
      type: 'utils/loadMaterialCompany',
      payload: {
        searchCode: '',
        companyType: this.props.companyType,
      },
    });
  }

  render() {
    const { utils } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus', 'companyType']);
    const { materialCompany, materialCompanyFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.materialCompany}`} >
        <span className={styles.companyName} >{option.companyName}</span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={materialCompany}
        optionRender={optionRender}
        valueRender={option => `${option.companyName}`}
        fetching={materialCompanyFetching}
        dropdownStyle={{ width: '200px' }}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(MaterialCompanySearchInput);

