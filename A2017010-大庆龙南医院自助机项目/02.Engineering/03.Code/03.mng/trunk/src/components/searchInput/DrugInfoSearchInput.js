import React, { Component, PropTypes } from 'react';
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
      <div className={`${styles.searchInput} ${styles.drugInfo}`} >
        <span className={styles.drugCode} >{option.drugCode}</span>
        <span className={styles.name} >{option.tradeName}</span>
        <span className={styles.drugType} >{dicts.dis('DRUG_TYPE', option.drugType)}</span>
        <span className={styles.drugSpecs} >{option.drugSpecs}</span>
        <span className={styles.salePrice} >{option.salePrice ? option.salePrice.formatMoney(2) : ''}</span>
        <span className={styles.companyName} >
          {option.companyInfo ? option.companyInfo.companyName : ''}
        </span>
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
        dropdownStyle={{ width: '700px' }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(DrugInfoSearchInput);

