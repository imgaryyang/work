import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
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
     * 项目分类：收费项 | 药品
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

  render() {
    const { utils, value, placeholder } = this.props;
    const { commonItems, commonItemsFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.commonItem}`} >
        <span className={styles.itemName} >{option.itemName}</span> {/* 项目名称/药品名称 */}
        <span className={styles.itemSpecs} >{option.itemSpecs}</span> {/* 规格 */}
        <span className={styles.itemUnit} >{option.itemUnit}</span> {/* 单位 */}
        <span className={styles.salePrice} >{option.salePrice ? option.salePrice.formatMoney(2) : ''}</span> {/* 售价 */}
        <span className={styles.companyName} >{option.companyName}</span> {/* 厂家 */}
        <span className={styles.stock} >{option.stock}</span> {/* 库存 */}
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        options={commonItems}
        optionRender={optionRender}
        valueRender={option => `${option ? option.itemName : ''}`}
        fetching={commonItemsFetching}
        dropdownStyle={{ width: '690px' }}
        value={value}
        placeholder={placeholder}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(CommonItemSearchInput);

