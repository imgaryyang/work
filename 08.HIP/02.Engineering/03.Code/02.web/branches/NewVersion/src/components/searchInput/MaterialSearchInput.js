import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';

import SearchInput from './SearchInput';

import styles from './SearchInput.less';

class MaterialSearchInput extends Component {

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
        materials: [],
      },
    });
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(item);
    }
  }

  onSearch(searchCode) {
    this.props.dispatch({
      type: 'utils/loadMaterials',
      payload: {
        searchCode,
      },
    });
  }

  onFocus() {
    this.props.dispatch({
      type: 'utils/loadMaterials',
      payload: {
        searchCode: '',
      },
    });
  }

  render() {
    const { utils } = this.props;
    const rest = _.omit(this.props, ['utils', 'dropdownStyle', 'onSelect', 'onSearch', 'onFocus']);
    const { materials, materialsFetching } = utils;

    const optionRender = option => (
      <div className={`${styles.searchInput} ${styles.materials}`} >
        <span className={styles.commonName} >{option.commonName}</span>
      </div>
    );

    return (
      <SearchInput
        onSearch={this.onSearch}
        onSelect={this.onSelect}
        onFocus={this.onFocus}
        options={materials}
        optionRender={optionRender}
        valueRender={option => `${option.commonName}`}
        fetching={materialsFetching}
        dropdownStyle={{ width: '200px' }}
        {...rest}
      />
    );
  }
}

export default connect(
  ({ utils }) => ({ utils }),
)(MaterialSearchInput);

