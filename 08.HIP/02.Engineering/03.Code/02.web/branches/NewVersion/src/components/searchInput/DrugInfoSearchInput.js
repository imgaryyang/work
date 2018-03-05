import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import SearchInput from './SearchInput';
import styles from './SearchInput.less';

class DrugInfoSearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE'],
    });
  }

  onSelect(item) {
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        regInfo: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadDrugInfo',
      payload: {
        searchCode,
      },
    });
  }

  render() {
    const { utils, value, placeholder } = this.props;
    const { drugInfo, drugInfoFetching, dicts } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.drugItem}`} >
        <span className={styles.drugCode} >{option.drugCode}</span> {/* 药品编码*/}
        <span className={styles.name} >{option.tradeName}</span> {/* 药品名称*/}
        <span className={styles.drugType} >{dicts.dis('DRUG_TYPE', option.drugType)}</span> {/* 药品类型 */}
        <span className={styles.drugSpecs} >{option.drugSpecs}</span> {/* 规格 */}
        <span className={styles.salePrice} >{option.salePrice ? option.salePrice.formatMoney(2) : ''}</span> {/* 价格 */}
        <span className={styles.companyName} >
          {option.companyInfo ? option.companyInfo.companyName : ''}
        </span> {/* 生产厂商 */}
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        options={drugInfo}
        optionRender={optionRender}
        valueRender={option => `${option.tradeName}`}
        fetching={drugInfoFetching}
        dropdownStyle={{ width: '780px' }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(DrugInfoSearchInput);

