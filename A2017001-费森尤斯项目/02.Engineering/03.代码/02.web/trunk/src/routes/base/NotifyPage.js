import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import { Collapse } from 'antd';

import CommonTable from '../../components/CommonTable';

const Panel = Collapse.Panel;

moment.locale('zh-CN');

class NotifyPage extends Component {
  render() {
    const { base: { notifyMsg }, columns } = this.props;

    const notifyKey = notifyMsg.map((v) => {
      return moment(v.createTime, 'YYYYMMDDhms').fromNow();
    });

    const notifyMap = _.groupBy(notifyMsg, (v) => {
      return moment(v.createTime, 'YYYYMMDDhms').fromNow();
    });

    const notifyContent = (data) => {
      return (
        <CommonTable
          data={data}
          columns={columns}
          rowSelection={false}
          showHeader={false}
          pagination={false}
        />
      );
    };

    const notifyPage = () => {
      const contentDom = [];
      for (const key of Object.keys(notifyMap)) {
        const item = notifyMap[key];

        contentDom.push(
          <Panel header={<strong>{key}</strong>} key={key}>
            { notifyContent(item) }
          </Panel>,
        );
      }
      return (
        <Collapse bordered={false} defaultActiveKey={[...notifyKey]}>
          { contentDom }
        </Collapse>
      );
    };

    return notifyPage();
  }
}
export default connect(
  ({ base }) => ({ base }),
)(NotifyPage);
