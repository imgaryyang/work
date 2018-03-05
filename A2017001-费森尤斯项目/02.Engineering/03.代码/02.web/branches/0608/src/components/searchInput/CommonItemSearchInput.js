import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class CommonItemSearchInput extends Component {

  static propTypes = {

    /**
     * 选中后回调
     */
    onSelect: PropTypes.func,

    /**
     * 项目类型：收费项 | 药品
     */
    itemType: PropTypes.string,

      /**
     * 套餐类别
     *   1  西药/成药
     *   2 草药
     *   3 非药
     */
    drugFlag: PropTypes.string,

      /**
     * 药品科室
     */
    deptId: PropTypes.string,

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
        commonItems: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadCommonItem',
      payload: {
        searchCode,
        type: this.props.itemType,
        drugFlag: this.props.drugFlag,
        deptId: this.props.deptId,
      },
    });
  }

  onFocus() {
    // console.log('onFocus in CompanySearchInput.');
    this.props.dispatch({
      type: 'utils/loadCommonItem',
      payload: {
        searchCode: '',
        type: this.props.itemType,
        drugFlag: this.props.drugFlag,
        deptId: this.props.deptId,
      },
    });
  }

  render() {
    const { utils, itemType, drugFlag } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus', 'itemType', 'drugFlag', 'deptId']);
    const { commonItems, commonItemsFetching } = utils;

    const optionRender = (option) => {
      return itemType === '0' || drugFlag === '3' ? (
        <div className={`${styles.searchInput} ${styles.commonItem}`} >
          <span className={styles.itemName} >{option.itemName}</span> {/* 项目名称/药品名称 */}
          <span className={styles.itemUnit} >{option.itemUnit}</span> {/* 单位 */}
          <span className={styles.salePrice} >{option.salePrice ? option.salePrice.formatMoney(2) : ''}</span> {/* 售价 */}
          <span className={styles.stock} >{option.stock}{option.itemUnit}</span> {/* 库存 */}
        </div>
      ) : (
        <div className={`${styles.searchInput} ${styles.commonItemDrug}`} >
          <span className={styles.itemName} >{option.itemName}</span> {/* 项目名称/药品名称 */}
          <span className={styles.itemSpecs} >{option.itemSpecs}</span> {/* 规格 */}
          <span className={styles.itemUnit} >{option.itemUnit}</span> {/* 单位 */}
          <span className={styles.salePrice} >{option.salePrice ? option.salePrice.formatMoney(2) : ''}</span> {/* 售价 */}
          <span className={styles.companyName} >{option.companyName}</span> {/* 厂家 */}
          <span className={styles.stock} >
            { option.stock % option.packQty !== 0 ? (_.floor(option.stock / option.packQty) + option.itemUnit + (option.stock % option.packQty) + option.miniUnit)
              : _.floor(option.stock / option.packQty) + option.itemUnit
            }
          </span>
          {/* 库存 */}
        </div>
      );
    };

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={commonItems}
        optionRender={optionRender}
        valueRender={option => `${option ? option.itemName : ''}`}
        fetching={commonItemsFetching}
        dropdownStyle={{ width: `${itemType === '0' || drugFlag === '3' ? 430 : 710}px` }}
        // value={value}
        // placeholder={placeholder}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(CommonItemSearchInput);

