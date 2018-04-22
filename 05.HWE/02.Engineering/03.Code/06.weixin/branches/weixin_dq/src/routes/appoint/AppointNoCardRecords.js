import React from 'react';
import { connect } from 'dva';
import { ListView } from 'antd-mobile';
import { isValidArray } from '../../utils/common';
import AppointRecord from './AppointRecord';
import less from './AppointNoCardRecords.less';

class AppointNoCardRecords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  render() {
    const { appoint: { noCardRecords, isLoading }, base: { user: { id: terminalUser } }, cancelAppoint } = this.props;

    return (
      <div className={less.container}>
        {
          terminalUser ?
            (
              isValidArray(noCardRecords) ?
                <ListView
                  dataSource={this.state.dataSource.cloneWithRows(noCardRecords)}
                  useBodyScroll
                  pageSize={8}
                  initialListSize={0}
                  renderSeparator={(sectionId, rowId) => <div key={rowId} className={less.rowSep} />}
                  renderRow={item => (
                    <AppointRecord
                      data={item}
                      onSubmit={cancelAppoint}
                      noCard
                    />
                )}
                /> : (isLoading ? null : <div className={less.noData}>查无预约记录</div>)
            ) :
            (<div className={less.noData}>无用户信息</div>)
        }
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(AppointNoCardRecords);
