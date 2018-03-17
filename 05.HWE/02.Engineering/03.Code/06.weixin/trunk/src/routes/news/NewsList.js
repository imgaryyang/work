import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { ListView, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import style from './NewsList.less';


class NewsList extends React.Component {
  componentWillMount() {
    const query = { fkId: 'com.lenovohit.msh', fkType: 'H4' };
    this.props.dispatch({
      type: 'news/loadnews',
      payload: query,
    });
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

  render() {
    const { data, dataSource, height, isLoading } = this.props.news;
    const row = (rowData, sectionID, rowID) => {
      return (<WingBlank size="lg"><WingBlank size="sm">
        <WhiteSpace size="lg" />
        <Card onClick={this.showDetail.bind(this, rowID)}>
          <img
            className={style['image']}
            alt=""
            // TODO: 图片指向java后台维护的新闻图片
            // src={require(`../../assets/images/${rowData.image}`)}
          />
          <Card.Body>
            <div>{rowData.createdAt}</div>
            <div>{rowData.caption}</div>
          </Card.Body>
        </Card>
        <WhiteSpace size="lg" />
      </WingBlank>
      </WingBlank>);
    };


    return (
      <div>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(data)}
          renderRow={row}
          style={{
          height,
          overflow: 'auto',
        }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={10}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
        <div style={{ height: 40 }} />
      </div>
    );
  }
}
NewsList.propTypes = {
};
export default connect(news => (news))(NewsList);
