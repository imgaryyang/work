import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { NavBar, ListView, Icon, Flex } from 'antd-mobile';
import ProfileList from '../patients/ProfileList';
import style from './RecordMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { colors } from '../../utils/common';

class RecordMain extends React.Component {
  constructor(props) {
    super(props);
    this.loadCheckList = this.loadCheckList.bind(this);
    this.goback = this.goback.bind(this);
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    // 已经选择了就诊人
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadCheckList(currProfile);
    }
  }
  loadCheckList(currProfile) {
    const query = currProfile;
    this.props.dispatch({
      type: 'record/loadRecordList',
      payload: query,
    });
  }
  goback() {
    this.props.dispatch(routerRedux.goBack());
  }
  showDetail(data) {
    const query = data;
    this.props.dispatch({
      type: 'record/loadRecordDetail',
      payload: query,
    });
    this.props.dispatch(routerRedux.push({
      pathname: 'recordDetail',
    }));
  }

  render() {
    const { data, dataSource, height, isLoading } = this.props.record;
    // 日期 ，门诊类别，医生，诊断，科室
    if (isLoading) { return <ActivityIndicatorView />; }
    const row = (rowData) => {
      const clinicTypeName = rowData.clinicTypeName?rowData.clinicTypeName: '普通门诊';
      return (<div className={style['rowContainer']} onClick={this.showDetail.bind(this, rowData)}>
        <div className={style['rowLeft']} >
          <Flex direction="row" align="center" >
            <div className={style['createTime']}>{moment(rowData.createTime).format('YYYY-MM-DD hh:mm')}</div>
            <div className={style['clinicTypeName']}>{clinicTypeName}</div>
          </Flex>
          <div className={style['docName']}>{rowData.docName}({rowData.docJobTitle})</div>
          <div className={style['diagnosis']}>{`诊断：${rowData.diagnosis || '暂无诊断信息'}`}</div>
        </div>
        <Flex direction="row" align="center" className={style['rowRight']}>
          <div className={style['depName']}>{rowData.depName}</div>
          <Icon type="right" color={colors.IOS_ARROW} />
        </Flex>
      </div>);
    };
    const separator = () => {
      return (<div className={style['separator']} />);
    };
    return (
      <div className={style['container']}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.goback()}
        > 就诊记录
        </NavBar>
        <div className={style['profile']}><ProfileList callback={this.loadCheckList} /></div>
        {data.length === 0 ? (<div style={{ padding: 30, textAlign: 'center', color: '#999999' }}>暂无符合查询条件的报告单信息</div>) : null}
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource.cloneWithRows(data)}
          renderSeparator={separator}
          renderRow={row}
          style={{
            height,
            overflow: 'auto',
          }}
          pageSize={10}
          onScroll={() => { console.log('scroll'); }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      </div>
    );
  }
}
//
// <div className={style['profile']}><ProfileList callback={this.loadCheckList} /></div>
// <ListView
//   ref={el => this.lv = el}
//   dataSource={dataSource.cloneWithRows(data)}
//   renderSeparator={separator}
//   renderRow={row}
//   style={{
//     height,
//     overflow: 'auto',
//   }}
//   pageSize={10}
//   onScroll={() => { console.log('scroll'); }}
//   onEndReached={this.onEndReached}
//   onEndReachedThreshold={10}
// />
// scrollRenderAheadDistance={500}
RecordMain.propTypes = {
};
export default connect(({ record, base }) => ({ record, base }))(RecordMain);
