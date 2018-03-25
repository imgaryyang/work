import React from 'react';
import { connect } from 'dva';
import { ListView, PullToRefresh, Flex, Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import classnames from 'classnames';
import less from './Schedule.less';
import { action, initPage, colors, clientHeight } from '../../utils/common';
import ModalSelect from '../../components/ModalSelect';
import Icon from '../../components/FAIcon';
import { initAreaData, initJobTitleData, initDateData, initShiftData } from '../../models/appointModel';

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      dateModal: false,
      jobTitleModal: false,
      shiftModal: false,
      areaModal: false,
    };
  }

  componentWillUnmount() {
    // unmount时清理数据
    this.props.dispatch(action('appoint/save', {
      // cond: {},
      isLoading: true,
      refreshing: false,
      allData: [],
      filterData: [],
      renderData: [],
      dateData: initDateData,
      selectedDate: initDateData[0],
      // unmount时清理数据
      jobTitleData: initJobTitleData,
      selectedJobTitle: initJobTitleData[0],
      shiftData: initShiftData,
      selectedShift: initShiftData[0],
      areaData: initAreaData,
      selectedArea: initAreaData[0],
      page: initPage,
    }));
  }

  onEndReached() {
    const { dispatch, appoint: { isLoading, refreshing, hasMore } } = this.props;
    // const { isLoading, refreshing, hasMore } = appoint;
    if (isLoading || refreshing || !hasMore) { return; }

    dispatch(action('appoint/forScheduleList'));
  }

  onRefresh() {
    const { dispatch } = this.props;

    dispatch(action('appoint/save', {
      refreshing: true,
      isLoading: true,
    }));
    dispatch(action('appoint/forScheduleList'));
  }

  onSelectRow(item) {
    if (item && item.enableNum > 0) {
      this.props.dispatch(action('appoint/save', {
        selectSchedule: item,
      }));

      this.props.dispatch(routerRedux.push({
        pathname: 'source',
        state: { item },
      }));
    } else {
      Toast.info('该排班已约满，请选择其他排班！', 1);
    }
  }

  onChange(propKey, modalKey, item) {
    this.props.dispatch(action('appoint/filterData', { [propKey]: item }));
    this.closeModal(modalKey);
  }

  showModal(e, modalKey) {
    e.preventDefault();
    this.setState({ [modalKey]: true });
  }

  closeModal(modalKey) {
    this.setState({ [modalKey]: false });
  }

  renderRow(item, sectionId, rowId) {
    return (
      <Flex key={rowId} direction="row" justify="around" className={less.row} onClick={() => this.onSelectRow(item)}>
        <Flex direction="column" justify="between" align="start" className={less.col1}>
          <div className={less.fontOrange}>{item.docName}</div>
          <div className={less.bottom}>{item.docJobTitle}</div>
        </Flex>
        <Flex direction="column" justify="between" align="start" className={less.col2}>
          <div>{item.clinicDate.slice(5)} {item.shiftName}</div>
          <div className={less.bottom}>{item.clinicTypeName}</div>
        </Flex>
        <Flex direction="row" justify="end" className={less.col3}>
          <div
            style={{ backgroundColor: item.enableNum ? colors.IOS_BLUE : colors.IOS_LIGHT_GRAY }}
            className={less.extra}
          >
            {item.enableNum ? `余:${item.enableNum}` : '约满'}
          </div>
        </Flex>
      </Flex>
    );
  }

  render() {
    const {
      isLoading,
      renderData,
      hasMore,
      refreshing,
      dateData,
      selectedDate,
      jobTitleData,
      selectedJobTitle,
      shiftData,
      selectedShift,
      areaData,
      selectedArea,
      page,
    } = this.props.appoint;

    const { dateModal, jobTitleModal, shiftModal, areaModal, dataSource } = this.state;

    return (
      <div>
        <Flex direction="row" justify="around" className={less.topBar}>
          <Flex className={classnames(less.item, less.flex5)} justify="center" align="center" onClick={e => this.showModal(e, 'dateModal')}>
            {selectedDate.label}
            <Icon type="caret-down" color={colors.IOS_ARROW} style={{ marginLeft: '4px' }} />
          </Flex>
          <div className={less.sep} />
          <Flex className={classnames(less.item, less.flex5)} justify="center" align="center" onClick={e => this.showModal(e, 'jobTitleModal')}>
            {selectedJobTitle.label}
            <Icon type="caret-down" color={colors.IOS_ARROW} style={{ marginLeft: '4px' }} />
          </Flex>
          <div className={less.sep} />
          <Flex className={classnames(less.item, less.flex4)} justify="center" align="center" onClick={e => this.showModal(e, 'shiftModal')}>
            {selectedShift.label}
            <Icon type="caret-down" color={colors.IOS_ARROW} style={{ marginLeft: '4px' }} />
          </Flex>
          <div className={less.sep} />
          <Flex className={classnames(less.item, less.flex4)} justify="center" align="center" onClick={e => this.showModal(e, 'areaModal')}>
            {selectedArea.label}
            <Icon type="caret-down" color={colors.IOS_ARROW} style={{ marginLeft: '4px' }} />
          </Flex>
        </Flex>
        <ListView
          dataSource={dataSource.cloneWithRows(renderData)}
          renderRow={(item, sectionId, rowId) => this.renderRow(item, sectionId, rowId)}
          renderSeparator={(sectionId, rowId) => <div key={rowId} className={less.sep} />}
          renderFooter={() => (
            <div className={less.footer}>
              { isLoading || hasMore ? '正在加载' : (page.total ? '加载完成' : '查无数据') }
            </div>
          )}
          style={{ height: clientHeight - 42, overflow: 'auto' }}
          pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
          pageSize={8}
          initialListSize={0}
          scrollRenderAheadDistance={500}
          onEndReachedThreshold={10}
          onEndReached={this.onEndReached}
        />
        <ModalSelect
          visible={dateModal}
          data={dateData}
          onClose={() => this.closeModal('dateModal')}
          onSelect={item => this.onChange('selectedDate', 'dateModal', item)}
        />
        <ModalSelect
          visible={jobTitleModal}
          data={jobTitleData}
          onClose={() => this.closeModal('jobTitleModal')}
          onSelect={item => this.onChange('selectedJobTitle', 'jobTitleModal', item)}
        />
        <ModalSelect
          visible={shiftModal}
          data={shiftData}
          onClose={() => this.closeModal('shiftModal')}
          onSelect={item => this.onChange('selectedShift', 'shiftModal', item)}
        />
        <ModalSelect
          visible={areaModal}
          data={areaData}
          onClose={() => this.closeModal('areaModal')}
          onSelect={item => this.onChange('selectedArea', 'areaModal', item)}
        />
      </div>
    );
  }
}

export default connect(appoint => (appoint))(Schedule);
