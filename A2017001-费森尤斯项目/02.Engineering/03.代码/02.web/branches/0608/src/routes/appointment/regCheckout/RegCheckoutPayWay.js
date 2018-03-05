import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CommonTable from '../../../components/CommonTable';
import Styles from './RegCheckout.less';

class RegCheckoutPayWay extends Component {
  render() {
    const { payWay, wsHeight } = this.props;
    const { dicts } = this.props.utils;

    const columns = [
      {
        title: '支付方式',
        dataIndex: 'payWay',
        key: 'payWay',
        width: 50,
        render: (value) => {
          return dicts.dis('PAY_MODE', value);
        },
      }, {
        title: '支付金额',
        dataIndex: 'amt',
        key: 'amt',
        width: 80,
        className: 'column-money',
        render: (value) => {
          return value.formatMoney();
        },
      },
    ];

    return (
      <div>
        <Row>
          <Col span={24}>
            <div className={Styles.fieldSet} >
              <div />
              <span>支付方式</span>
            </div>
          </Col>
        </Row>
        <CommonTable
          rowKey="payWay"
          size="small"
          data={payWay}
          columns={columns}
          rowSelection={false}
          paginationStyle="mini"
          scroll={{ y: (wsHeight - 250) }}
        />
      </div>
    );
  }
}

export default RegCheckoutPayWay;
