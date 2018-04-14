import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { ListView, Flex, Button, PullToRefresh } from 'antd-mobile';

import Icon from '../../components/FAIcon';
import style from './RecordMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { colors } from '../../utils/common';
import commonStyles from '../../utils/common.less';
import Global from '../../Global';
import Tags from '../../components/Tags';

class RecordMain extends React.Component {
  constructor(props) {
    super(props);
    this.loadCheckList = this.loadCheckList.bind(this);
    this.goback = this.goback.bind(this);
    this.refresh = this.refresh.bind(this);
    this.showDetail = this.showDetail.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '就诊记录',
        hideNavBarBottomLine: false,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
  }

  componentDidMount() {
    const { currProfile } = this.props.base;
    // 已经选择了就诊人
    const arr = Object.keys(currProfile);
    // 已经选择了就诊人
    if (arr.length !== 0) {
      this.loadCheckList(currProfile);
    }
  }
  //
  // componentWillReceiveProps(props) {
  //   if (props.base.currProfile !== this.props.base.currProfile) {
  //     this.loadCheckList(props.base.currProfile);
  //   }
  // }

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
    // rowData
    this.props.dispatch({
      type: 'record/setState',
      payload: { rowData: data },
    });
    this.props.dispatch({
      type: 'record/loadRecordDetail',
      payload: query,
    });
    this.props.dispatch(routerRedux.push({
      pathname: 'recordDetail',
    }));
  }
  refresh() {
    const { currProfile } = this.props.base;
    const query = currProfile;
    this.props.dispatch({
      type: 'record/loadRecordList',
      payload: query,
    });
  }

  render() {
    const { data, dataSource, height, isLoading, refreshing } = this.props.record;
    const { currProfile } = this.props.base;
    // console.log("ReportMain===data===",data);
    // 日期 ，门诊类别，医生，诊断，科室
    if (isLoading) { return <ActivityIndicatorView />; }
    if (!currProfile.id) {
      return (
        <div className={commonStyles.emptyViewContainer}>
          <div className={commonStyles.emptyView}>请先选择就诊人！
            <Button
              type="ghost"
              inline
              style={{ marginTop: 10, width: 200 }}
              onClick={() => this.props.dispatch(routerRedux.push({ pathname: 'choosePatient' }))}
            >选择就诊人
            </Button>
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className={commonStyles.emptyViewContainer}>
          <div className={commonStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的检查信息！`}</div>
        </div>
      );
    }
    const row = (rowData, idx) => {
      const { tagConfig } = Global.Config;
      const tags = [rowData.clinicTypeName ? { ...tagConfig.clinicTypeOther, label: rowData.clinicTypeName } : tagConfig.clinicTypeNormal];

      const borderTop = idx !== 0 ? { borderTop: `1px solid ${colors.LINE}` } : {};
      const borderBottom = idx !== data.length - 1 ? { borderBottom: `1px solid ${colors.LINE}`, marginBottom: 5, } : {};
      return (
        <div
          key={idx}
          className={style['rowContainer']}
          onClick={this.showDetail.bind(this, rowData)}
          style={{ ...borderTop, ...borderBottom }}
        >
          <Flex direction="column" align="start" className={style['rowLeft']} >
            <Flex direction="row" align="center">
              <div className={style['createTime']}>{moment(rowData.createTime).format('YYYY-MM-DD hh:mm')}</div>
              <Tags tags={tags} />
            </Flex>
            <Flex direction="row" align="center" >
              <div className={style['docName']}>{rowData.docName} &thinsp;</div>
              <div className={style['docJobTitle']}>{rowData.docJobTitle ? `(${rowData.docJobTitle})` : ''}</div>
            </Flex>
            <Flex direction="row" align="center" >
              <div className={style['diagnosis']}>{`诊断：${rowData.diagnosis || '暂无诊断信息'}`}</div>
            </Flex>
          </Flex>
          <Flex direction="column" align="end" className={style['rowRight']} >
            <Flex direction="row" align="center" className={style['test']}>
              <div className={style['depName']}>{rowData.depName}</div>
              <Icon type="angle-right" color={colors.IOS_ARROW} className={style['logo']} />
            </Flex>
          </Flex>
        </div>
      );
    };

    const separator = () => {
      return (<div className={style['separator']} />);
    };
    return (
      <div className={style['container']}>
        <ListView
          ref={(el) => { this.lv = el; }}
          dataSource={dataSource.cloneWithRows(data)}
          renderRow={row}
          style={{
            height,
            overflow: 'auto',
          }}
          pageSize={10}
          // 下拉刷新
          pullToRefresh={<PullToRefresh
            refreshing={refreshing}
            onRefresh={this.refresh}
            style={{
              borderBottomWidth: 0,
            }}
          />}
        />
      </div>
    );
  }
}
RecordMain.propTypes = {
};
export default connect(({ record, base }) => ({ record, base }))(RecordMain);
