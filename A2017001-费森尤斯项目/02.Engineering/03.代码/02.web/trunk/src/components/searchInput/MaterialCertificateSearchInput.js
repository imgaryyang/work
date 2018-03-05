import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class MaterialCertificateSearchInput extends Component {

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
    this.onFocus = this.onFocus.bind(this);
  }

  onSelect(item) {
    this.props.dispatch({
      type: 'utils/setState',
      payload: {
        materialCertificate: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadMaterialCertificate',
      payload: {
        searchCode,
      },
    });
  }

  onFocus() {
    this.props.dispatch({
      type: 'utils/loadMaterialCertificate',
      payload: {
        searchCode: '',
      },
    });
  }

  render() {
    const { utils } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus']);
    const { materialCertificate, materialCertificateFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.materialCertificate}`} >
        <span className={styles.regName} >{option.regName}</span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={materialCertificate}
        optionRender={optionRender}
        valueRender={option => `${option.regName}`}
        fetching={materialCertificateFetching}
        dropdownStyle={{ width: '200px' }}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(MaterialCertificateSearchInput);

