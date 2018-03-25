import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from './FAIcon';
import styles from './SearchInput.less';

class SearchInput extends PureComponent {
  static displayName = 'SearchInput';
  static description = '搜索框组件';

  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
  }

  state = {
    value: this.props.value,
  }

  /**
   * 组件接收参数变化
   */
  componentWillReceiveProps(/* props*/) {
    // this.setState(props);
  }

  onChangeText(e) {
    this.setState({ value: e.target.value }, () => {
      this.props.onChangeText(this.state.value);
    });
  }

  render() {
    const { style, onSearch } = this.props;
    const btnVisible = this.state.value ? 'flex' : 'none';
    return (
      <div className={styles.container} style={style || {}} >
        <div className={styles.iconContainer}>
          <Icon type="search" className={styles.searchIcon} />
        </div>
        <input
          className={styles.searchInput}
          placeholder={this.props.placeholder || '请输入查询条件'}
          value={this.state.value}
          onChange={this.onChangeText}
          maxLength={60}
        />
        <div
          className={classnames(styles.iconContainer, styles.clearBtn)}
          style={{ width: 50, display: btnVisible }}
          onClick={() => {
            this.setState({ value: '' });
          }}
        >
          <Icon type="times" className={styles.clearIcon} />
        </div>
        <div
          className={styles.searchBtn}
          style={{ display: btnVisible }}
          onClick={() => onSearch(this.state.value)}
        >
          <div className={styles.searchBtnText} >查询</div>
          <Icon type="arrow-right" className={styles.searchBtnIcon} />
        </div>
      </div>
    );
  }
}

SearchInput.propTypes = {

  /**
   * 初始值
   */
  value: PropTypes.string,

  /**
   * onChangeText回调函数
   */
  onChangeText: PropTypes.func,

  /**
   * onSearch回调函数
   */
  onSearch: PropTypes.func,

  /**
   * 样式
   */
  style: PropTypes.object,

};

SearchInput.defaultProps = {
  value: '',
  onChangeText: () => {},
  onSearch: () => {},
  style: {},
};

export default SearchInput;
