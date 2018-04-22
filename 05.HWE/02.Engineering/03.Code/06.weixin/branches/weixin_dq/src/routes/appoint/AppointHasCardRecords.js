import React from 'react';
import { connect } from 'dva';
import { ListView } from 'antd-mobile';
import { isValidArray } from '../../utils/common';
import AppointRecord from './AppointRecord';
import less from './AppointHasCardRecords.less';

class AppointHasCardRecords extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  render() {
    const { appoint: { hasCardRecords, isLoading }, base: { currProfile: { no: proNo, name: proName } }, cancelAppoint } = this.props;

    return (
      <div className={less.container}>
        {
          proNo ?
            (
              isValidArray(hasCardRecords) ?
                <ListView
                  dataSource={this.state.dataSource.cloneWithRows(hasCardRecords)}
                  useBodyScroll
                  pageSize={8}
                  initialListSize={0}
                  renderSeparator={(sectionId, rowId) => <div key={rowId} className={less.rowSep} />}
                  renderRow={item => (
                    <AppointRecord
                      data={{ ...item, proName }}
                      onSubmit={cancelAppoint}
                      noCard={false}
                    />
                  )}
                /> : (isLoading ? null : <div className={less.noData}>查无预约记录</div>)
            ) :
            (<div className={less.noData}>无就诊人信息</div>)
        }
      </div>
    );
  }
}

export default connect(({ appoint, base }) => ({ appoint, base }))(AppointHasCardRecords);
