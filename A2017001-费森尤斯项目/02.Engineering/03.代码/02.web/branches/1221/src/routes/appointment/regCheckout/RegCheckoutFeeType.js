import React, { Component } from 'react';
import { Row, Col } from 'antd';
import CommonTable from '../../../components/CommonTable';
import Styles from './RegCheckout.less';

class RegCheckoutFeeType extends Component {

  render() {
    const { feeType, wsHeight } = this.props;
    const { dicts } = this.props.utils;

    const columns = [
      {
        title: '收费项目',
        dataIndex: 'feeType',
        key: 'feeType',
        width: 50,
        render: (value) => {
          return dicts.dis('FEE_CODE', value);
        },
      }, {
        title: '收费金额',
        dataIndex: 'feeAmt',
        key: 'feeAmt',
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
              <span>费用分类</span>
            </div>
          </Col>
        </Row>
        <CommonTable
          rowKey="feeType"
          size="small"
          data={feeType}
          columns={columns}
          rowSelection={false}
          paginationStyle="mini"
          scroll={{ y: (wsHeight - 250) }}
        />
      </div>
    );
  }
}

export default RegCheckoutFeeType;
