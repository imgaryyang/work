import React from 'react';
import { connect } from 'dva';
import { ListView, PullToRefresh, Flex, Icon, Toast, Radio, Modal } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import less from './Schedule.less';
import { action, initPage, colors, clientHeight } from '../../utils/common';

const { RadioItem } = Radio;

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      areaModal: false,
      selectedArea: 0,
    };
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { allData: [], renderData: [], page: initPage }));
  }

  onEndReached() {
    const { dispatch, appoint } = this.props;
    const { isLoading, refreshing, hasMore } = appoint;
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
    console.log('item', item);
    if (item && item.enableNum > 0) {
      this.props.dispatch(action('appoint/save', {
        selectSchedule: item,
      }));

      this.props.dispatch(routerRedux.push({
        pathname: 'source',
        state: { item: { ...item, schNo: 5 } }, // 写死5，方便测试
      }));
    } else {
      Toast.info('该排班已约满，请选择其他排班！', 1);
    }
  }

  onAreaChange(value) {
    console.log('value', value);
    this.setState({ selectedArea: value }, () => {
      this.closeModal('areaModal');
    });
  }

  showModal(e, key) {
    e.preventDefault();
    this.setState({ [key]: true });
  }

  closeModal(key) {
    this.setState({ [key]: false });
  }

  renderRow(item, sectionId, rowId) {
    return (
      <Flex key={rowId} direction="row" justify="around" className={less.row} onClick={() => this.onSelectRow(item)}>
        <Flex direction="column" justify="between" className={less.col}>
          <div className={less.fontOrange}>{item.docName}</div>
          <div className={less.bottom}>{item.docJobTitle}</div>
        </Flex>
        <Flex direction="column" justify="between" className={less.col}>
          <div>{item.clinicDate.slice(5)} {item.shiftName}</div>
          <div className={less.bottom}>{item.clinicTypeName}</div>
        </Flex>
        <Flex direction="row" justify="end" className={less.col}>
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
    const { isLoading, renderData, hasMore, refreshing, areaData } = this.props.appoint;
    const { selectedArea } = this.state;

    console.log('areaData', areaData);
    console.log('selectedArea', selectedArea);

    return (
      <div>
        <Flex direction="row" justify="around" className={less.topBar}>
          <div className={less.item}>所有日期</div>
          <Icon type="right" color={colors.IOS_ARROW} />
          <div className={less.item}>全部职称</div>
          <Icon type="right" color={colors.IOS_ARROW} />
          <div className={less.item}>全天</div>
          <Icon type="right" color={colors.IOS_ARROW} />
          <div className={less.item} onClick={e => this.showModal(e, 'areaModal')}>全院</div>
        </Flex>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(renderData)}
          renderRow={(item, sectionId, rowId) => this.renderRow(item, sectionId, rowId)}
          renderSeparator={(sectionId, rowId) => <div key={rowId} className={less.sep} />}
          renderFooter={() => (
            <div className={less.footer}>
              { isLoading || hasMore ? '正在加载' : '加载完成' }
            </div>
          )}
          style={{ height: clientHeight - 42, overflow: 'auto' }}
          pullToRefresh={
            <PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />
          }
          pageSize={8}
          initialListSize={0}
          scrollRenderAheadDistance={500}
          onEndReachedThreshold={10}
          onEndReached={this.onEndReached}
        />
        <Modal
          visible={this.state.areaModal}
          transparent
          animationType="fade"
          onClose={() => this.closeModal('areaModal')}
          className={less.modal}
          s
        >
          <div style={{ maxHeight: (clientHeight * 0.8) }}>
            {
              areaData.map(item => (
              <RadioItem key={item.value} checked={selectedArea === item.value} onClick={() => this.onAreaChange(item.value)}>
                {item.label}
              </RadioItem>
            ))
            }
            {/*<RadioItem checked onClick={this.onAreaChange}>*/}
              {/*<span className={less.font14}>全院</span>*/}
            {/*</RadioItem>*/}
          </div>
        </Modal>
      </div>
    );
  }
}

Schedule.propTypes = {
};

export default connect(appoint => (appoint))(Schedule);
