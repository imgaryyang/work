import React from 'react';
import { connect } from 'dva';
import { ListView, Flex, Icon } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { action, clientHeight, colors } from '../../utils/common';
import less from './AppointRecords.less';

class AppointRecords extends React.Component {
  constructor(props) {
    super(props);

    this.gotoDetail = this.gotoDetail.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  componentWillUnmount() {
    this.props.dispatch(action('appoint/save', { appointRecordsData: [] }));
  }

  gotoDetail(item) {
    this.props.dispatch(routerRedux.push({
      pathname: 'recordDetail',
      state: { item },
    }));
  }

  render() {
    const { appointRecordsData } = this.props.appoint;

    return (
      <div>
        <ListView
          dataSource={this.state.dataSource.cloneWithRows(appointRecordsData)}
          style={{ height: clientHeight, overflow: 'auto' }}
          useBodyScroll
          pageSize={8}
          initialListSize={0}
          // scrollRenderAheadDistance={500}
          // onEndReachedThreshold={10}
          // onEndReached={this.onEndReached}
          renderSeparator={(sectionId, rowId) => <div key={rowId} className={less.rowSep} />}
          renderRow={(item) => {
            return (
              <div>
                <div className={less.header}>
                  <Flex direction="row" align="center" className={less.top}>
                    <div className={less.main}>{item.hosName}</div>
                    <div className={less.extra}>{item.statusName}</div>
                  </Flex>
                  <div className={less.bottom}>
                    {item.docName}&nbsp;&nbsp;&nbsp;&nbsp;{item.clinicTypeName}&nbsp;&nbsp;&nbsp;&nbsp;{item.depName}
                  </div>
                </div>
                <div className={less.rowDivSep} />
                <div className={less.body}>
                  <Flex direction="row" align="center" className={less.row}>
                    <div className={less.flex1}>
                      {item.proName} <span>（无卡预约）</span>
                    </div>
                    <div>{item.mobile}</div>
                  </Flex>
                  <Flex direction="row" align="center" className={less.row}>
                    <div className={less.flex1}>预约时间</div>
                    <div>{`${item.clinicDate} ${item.clinicTime}`}</div>
                  </Flex>
                  <Flex direction="row" align="center" className={less.row}>
                    <div className={less.flex1}>挂号费</div>
                    <div className={less.fontOrange}>¥{item.totalFee}</div>
                  </Flex>
                </div>
                <div className={less.rowDivSep} />
                <Flex direction="row" align="center" className={less.footer}>
                  <div className={less.left} onClick={() => this.gotoDetail(item)}>查看更多</div>
                  <Icon type="right" color={colors.IOS_ARROW} />
                </Flex>
              </div>
            );
          }}
        />
      </div>
    );
  }
}

export default connect(appoint => (appoint))(AppointRecords);
