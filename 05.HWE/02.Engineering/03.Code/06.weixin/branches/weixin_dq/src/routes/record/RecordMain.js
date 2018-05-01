import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
import { ListView, Flex, Button, PullToRefresh } from 'antd-mobile';

import Icon from '../../components/FAIcon';
import style from './RecordMain.less';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import { colors } from '../../utils/common';
import baseStyles from '../../utils/base.less';
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
        title: '就诊记录查询',
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
  componentWillUnmount() {
    this.props.dispatch({
      type: 'record/setState',
      payload: { data: [] },
    });
  }
  loadCheckList(currProfile) {
    const query = currProfile;
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(365, 'days').format('YYYY-MM-DD');
    const newQuery = { ...query, startDate, endDate, proNo: query.no };
    this.props.dispatch({
      type: 'record/loadRecordList',
      payload: newQuery,
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
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(365, 'days').format('YYYY-MM-DD');
    const query = { ...currProfile, startDate, endDate, proNo: currProfile.no };
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
        <div className={baseStyles.emptyViewContainer}>
          <div className={baseStyles.emptyView}>请先选择就诊人！
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
        <div className={baseStyles.emptyViewContainer}>
          <div className={baseStyles.emptyView}>{`暂无${currProfile.name}（卡号：${currProfile.no}）的检查信息！`}</div>
        </div>
      );
    }
    const row = (rowData, idx) => {
      const { tagConfig } = Global.Config;
      const tags = [rowData.clinicTypeName ? { ...tagConfig.clinicTypeOther, label: rowData.clinicTypeName } : tagConfig.clinicTypeNormal];

      const borderTop = idx !== 0 ? { borderTop: `1px solid ${colors.LINE}` } : {};
      const borderBottom = idx !== data.length - 1 ? { borderBottom: `1px solid ${colors.LINE}` } : {};
      return (
        <div
          key={idx}
          className={style['rowContainer']}
          onClick={this.showDetail.bind(this, rowData)}
          style={{ ...borderTop, ...borderBottom }}
        >
          <Flex direction="column" align="start" className={style['rowLeft']} >
            <Flex direction="row" align="center">
              <div className={style['createTime']}>{moment(rowData.treatStart).format('YYYY-MM-DD HH:mm')}</div>
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
          <div className={style['depName']}>{rowData.depName}</div>
          <div className={baseStyles.chevronContainer}>
            <Icon type="angle-right" color={colors.IOS_ARROW} className={baseStyles.chevron} />
          </div>
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
            backgroundColor: colors.IOS_GRAY_BG,
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
