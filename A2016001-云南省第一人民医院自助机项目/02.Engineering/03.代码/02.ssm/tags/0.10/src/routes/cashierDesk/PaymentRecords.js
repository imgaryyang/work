import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PaymentRecords.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';
import ToolBar              from '../../components/ToolBar';

class PaymentRecords extends React.Component {

  static displayName = 'PaymentRecords';
  static description = '预存消费记录查询';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    filterType: 'all'
  };

  componentWillMount () {
    this.props.dispatch({
      type: 'order/loadOrderList',
      payload: {
        type: this.state.filterType
      },
    });
  }

  constructor(props) {
    super(props);
    this.renderItems  = this.renderItems.bind(this);
    this.filter       = this.filter.bind(this);
  }

  filter (type) {
    this.setState({filterType: type}, () => {
      this.props.dispatch({
        type: 'order/loadOrderList',
        payload: {
          type: type
        },
      });
    });
  }

  render() {

    const filterStyle = {
      backgroundColor: '#BC1E1E',
      color: '#ffffff',
    };
    
    return (
      this.props.order.ordersLoaded == true && this.props.order.orders.length == 0 ? (
        <Empty info = '暂无预存/消费记录' />
      ) : (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >

          <ToolBar style = {{paddingTop: '10px'}} >
            <Row className = {styles.toolBarItems} >
              <Col span = {8} className = {styles.toolBarItem} >
                <Card shadow = {true} onClick = {() => this.filter('all')} style = {this.state.filterType == 'all' ? filterStyle : {}} >
                  全部
                </Card>
              </Col>
              <Col span = {8} className = {styles.toolBarItem} >
                <Card shadow = {true} onClick = {() => this.filter('prepaid')} style = {this.state.filterType == 'prepaid' ? filterStyle : {}} >
                  只看预存
                </Card>
              </Col>
              <Col span = {8} className = {styles.toolBarItem} >
                <Card shadow = {true} onClick = {() => this.filter('pay')} style = {this.state.filterType == 'pay' ? filterStyle : {}} >
                  只看消费
                </Card>
              </Col>
            </Row>
          </ToolBar>

          <Row>
            <Col span = {4} className = {listStyles.title} >发生时间</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >操作类型</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.amt} >金额</Col>
            <Col span = {6} className = {listStyles.title + ' ' + listStyles.center} >渠道</Col>
            <Col span = {8} className = {listStyles.title} >备注</Col>
          </Row>
          <Card shadow = {true} radius = {false} className = {styles.rows} >
            {this.renderItems()}
          </Card>
          
        </WorkSpace>
      )
    );
  }

  renderItems () {
    return this.props.order.orders.map (
      (row, idx) => {
        const { PaidDate, OrderTypeName, SelfPaid, PaidTypeName, Settlements } = row;

        return (
          <div key = {'_order_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {4} className = {listStyles.item} >
                {moment(PaidDate).format('YYYY-MM-DD')}<br/>{moment(PaidDate).format('HH:mm')}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
                {OrderTypeName}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt} >
                {SelfPaid.formatMoney()}
              </Col>
              <Col span = {6} className = {listStyles.item + ' ' + listStyles.center} >
                {PaidTypeName}
              </Col>
              <Col span = {8} className = {listStyles.item} >
                {Settlements[0].Desc}
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}

export default connect(({order, message}) => ({order, message}))(PaymentRecords);





