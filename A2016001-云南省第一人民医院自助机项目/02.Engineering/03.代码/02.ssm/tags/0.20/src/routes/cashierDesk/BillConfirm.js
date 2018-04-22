import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './BillConfirm.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';

class BillConfirm extends React.Component {

  static displayName = 'BillConfirm';
  static description = '支付确认';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
    this.goToPay = this.goToPay.bind(this);
  }

  componentWillMount() {
  }

  goToPay () {

    this.props.dispatch(routerRedux.push({
      pathname: '/paymentChannels',
      state: {
        nav: {
          title: '选择支付方式',
          backDisabled: false,
        },
      },
    }));

  }

  render() {
    let wsHeight    = 50 * config.remSize,
        cardHeight  = 28 * config.remSize;

    const {selectedBills, billBrief, preSettlement} = this.props.bill;

    /*console.log('keys:', Object.keys(billBrief));
    for (var key in billBrief) {
      console.log(key);
    }*/

    return (
      <WorkSpace fullScreen = {true} >
        <WorkSpace height = {wsHeight + 'px'} style = {{padding: '3rem', fontSize: '2.6rem', lineHeight: '5rem'}} >
          <Row>
            <Col span = {11} style = {{padding: '0 1.5rem 3rem 0'}} >
              <Card shadow = {true} style = {{height: cardHeight + 'px', padding: '2rem'}} >
                <Row>
                  <Col span = {16} style = {{color: '#999999'}} >收费项</Col>
                  <Col span = {8} style = {{color: '#999999'}} className = {listStyles.amt} >金额</Col>
                </Row>
                {
                  Object.keys(billBrief).map(
                    (row, idx) => {
                      if (row != 'totalAmt')
                        return (
                          <Row key = {'_bill_brief_item_' + idx} >
                            <Col span = {16} >{row}</Col>
                            <Col span = {8} className = {listStyles.amt} >{billBrief[row].formatMoney()}</Col>
                          </Row>
                        );
                    }
                  )
                }
                <Row style = {{color: '#BC1E1E'}} >
                  <Col span = {16} >合计：</Col>
                  <Col span = {8} className = {listStyles.amt} >{preSettlement['totalAmt'].formatMoney()}</Col>
                </Row>
              </Card>
            </Col>
            <Col span = {13} style = {{padding: '0 0 3rem 1.5rem'}} >
              <Card shadow = {true} style = {{height: cardHeight + 'px', padding: '2rem'}} >
                <Row>
                  <Col span = {16} className = {listStyles.amt} >共需支付：</Col>
                  <Col span = {8} className = {listStyles.amt} >{preSettlement['totalAmt'].formatMoney()}</Col>
                </Row>
                <Row>
                  <Col span = {16} className = {listStyles.amt} >医保报销：</Col>
                  <Col span = {8} className = {listStyles.amt} >{preSettlement['MIPay'].formatMoney()}</Col>
                </Row>
                <Row>
                  <Col span = {16} className = {listStyles.amt} style = {{whiteSpace: 'nowrap'}} >医保个人账户支付：</Col>
                  <Col span = {8} className = {listStyles.amt} >{preSettlement['MIPAPay'].formatMoney()}</Col>
                </Row>
                <Row style = {{color: '#BC1E1E'}} >
                  <Col span = {16} className = {listStyles.amt} >还需支付：</Col>
                  <Col span = {8} className = {listStyles.amt} >{preSettlement['amt'].formatMoney()}</Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Button text = "确认缴费" onClick = {this.goToPay} />
        </WorkSpace>
      </WorkSpace>
    );
  }
}
  

export default connect(({account, bill, message}) => ({account, bill, message}))(BillConfirm);



