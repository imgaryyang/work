import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { ListView, PullToRefresh } from 'antd-mobile';

import SearchInput from '../../components/SearchInput';
import { image } from '../../services/baseService';

import styles from './NewsList.less';
import commonStyles from '../../utils/common.less';

const initQuery = { fkId: 'com.lenovohit.msh', fkType: 'H4' };

class NewsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  componentWillMount() {
    const { dispatch, news } = this.props;
    // const { title } = base;
    dispatch({
      type: 'base/save',
      payload: {
        title: '健康资讯',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: false,
        headerRight: null,
      },
    });
    if (news.dataArray.length === 0) {
      dispatch({
        type: 'news/refresh',
        payload: {
          ...initQuery,
        },
      });
    }
  }

  showDetail(rowID) {
    this.props.dispatch({
      type: 'news/setState',
      payload: { rowID },
    });
    this.props.dispatch(routerRedux.push({
      pathname: 'newsDetail',
    }));
  }

  renderRow(rowData, sectionID, rowID) {
    const { screen } = this.props.base;
    // console.log(rowID);
    return (
      <div key={rowID} >
        <div className={commonStyles.sep15} />
        <div className={styles.itemContainer} onClick={() => this.showDetail(rowID)} >
          <div
            className={styles.image}
            style={{
              width: screen.width - 30,
              height: (screen.width - 30) * 177 / 340,
              backgroundImage: `url(${image(rowData.image)})`,
            }}
          />
          <div className={styles.caption} >{rowData.caption}</div>
          <div className={styles.createAt} >{rowData.createdAt}</div>
        </div>
      </div>
    );
  }

  render() {
    const { dataArray, dataSource, refreshing, isLoading, noMoreData } = this.props.news;
    // console.log(refreshing, isLoading, noMoreData);
    return (
      <div className={styles.container} >
        <div className={styles.searchBar} >
          <SearchInput
            onSearch={cond => this.props.dispatch({
              type: 'news/search',
              payload: {
                ...initQuery,
                fuzzySearch: cond,
              },
            })}
          />
        </div>
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={dataSource.cloneWithRows(dataArray)}
          className={styles.list}
          pageSize={10}
          // 渲染行
          renderRow={this.renderRow}
          // 渲染行间隔
          // renderSeparator={() => <div className={commonStyles.sep15} />}
          // 下拉刷新
          pullToRefresh={<PullToRefresh
            refreshing={refreshing}
            onRefresh={() => this.props.dispatch({
              type: 'news/refresh',
              payload: {
                ...initQuery,
              },
            })}
            style={{
              borderBottomWidth: 0,
            }}
          />}
          // 无限加载
          onEndReached={() => {
            if (!noMoreData) {
              this.props.dispatch({
                type: 'news/infiniteLoad',
                payload: {},
              });
            }
          }}
          onEndReachedThreshold={10}
          renderFooter={() => (
            <div className={commonStyles.listFooterContainer} >
              {isLoading ? '载入更多数据...' : (noMoreData ? '所有数据载入完成' : '')}
            </div>
          )}
        />
      </div>
    );
  }
}

NewsList.propTypes = {
};

export default connect(({ news, base }) => ({ news, base }))(NewsList);
