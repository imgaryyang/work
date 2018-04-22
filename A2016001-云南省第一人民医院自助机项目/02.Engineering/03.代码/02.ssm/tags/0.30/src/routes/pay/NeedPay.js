import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './NeedPay.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';

import checked              from '../../assets/base/checked.png';
import unchecked            from '../../assets/base/unchecked.png';

class NeedPay extends React.Component {

  static displayName = 'NeedPay';
  static description = '待缴费项目';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    detailVisible: {},
  };

  _defaultVisible = config.pay.needPayDetailsDefaultVisible;

  componentWillMount () {
    this.props.dispatch({
      type: 'order/loadNeedPay',
      payload: {
      },
    });
  }

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.showDetail     = this.showDetail.bind(this);
    this.onCheck        = this.onCheck.bind(this);
    this.goToPay        = this.goToPay.bind(this);
  }

  /**
  * 显示处方详情
  */
  showDetail (idx) {
    let v = this.state.detailVisible;
    v['d_' + idx] = typeof v['d_' + idx] == 'undefined' ? !this._defaultVisible : !v['d_' + idx];
    this.setState({detailVisible: v});
  }
  
  /**
  * 选择处方
  */
  onCheck (item) {
    let s = this.props.order.selectedIds, total = this.props.order.selectedTotalAmt;
    if (s.indexOf(item.prescriptionId) == -1) {
      s += item.prescriptionId + ';';
      total += item.totalAmt;
      //numAdd(num1, num2)
      //total = digitUtil.numAdd(total,(item.totalAmt));
    } else {
      s = s.replace(item.prescriptionId + ';', '');
      total -= item.totalAmt;
      //numSub(num1, num2)
      //total = digitUtil.numSub(total,(item.totalAmt));
    }
    this.props.dispatch({
      type: 'order/setState',
      payload: {
        selectedIds: s,
        selectedTotalAmt: total,
      },
    });
  }

  goToPay () {
    let { needPayList, selectedIds } = this.props.order;
    if (!selectedIds) {
      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: '请选择要缴费的处方！',
        }
      });
      return;
    }

    //医保预结算
    this.props.dispatch({type: 'order/miPreSettlement'});

    //TODO: 转向到收银台
    this.props.dispatch(routerRedux.push({
      pathname: '/paymentConfirm',
      state: {
        nav: {
          title: '确认缴费',
        },
      },
    }));
  }

  render() {
    const btnHeight   = 10 * config.remSize,
          listHeight  = config.getWS().height - btnHeight - 2 * config.remSize;
    
    return (
      this.props.order.needPayListLoaded && this.props.order.needPayList.length == 0 ? (
        <Empty info = '暂无待缴费项目' />
      ) : (
        <WorkSpace fullScreen = {true} >
          <div className = {styles.listContainer} style = {{height: listHeight + 'px', paddingTop: '2rem'}} >
            {this.renderItems()}
            <Card  radius = {false} style = {{marginBottom: '1rem'}} >
              <Row className = {styles.footer} >
                <Col span = {17} >如果您是医保用户，请将医保卡插入医保卡读卡器！</Col>
                <Col span = {5} style = {{textAlign: 'right'}} >合计：{this.props.order.selectedTotalAmt.formatMoney()}</Col>
                <Col span = {2} ></Col>
              </Row>
            </Card>
          </div>
          <div className = {styles.buttonContainer} style = {{height: listHeight + 'px'}} >
            <Button text = '去缴费' onClick = {this.goToPay} />
          </div>
        </WorkSpace>
      )
    );

  }

  renderItems () {

    return this.props.order.needPayList.map (
      (row, idx) => {
        const { prescriptionId, prescriptionDate, deptId, deptName, doctorId, doctorName, typeId, typeName, totalAmt, items } = row;

        let detailVisible   = typeof this.state.detailVisible['d_' + idx] == 'undefined' ? this._defaultVisible : this.state.detailVisible['d_' + idx],
            detailCntnStyle = {
              display: detailVisible ? 'block' : 'none'
            },
            visibleIcon     = detailVisible ? 'caret-up' : 'caret-down',
            selectedIds     = this.props.order.selectedIds,
            checkIcon       = selectedIds.indexOf(prescriptionId + ';') == -1 ? unchecked : checked;//'close-circle-o' : 'check-circle-o';

        return (
          <Card  radius = {false} key = {'_np_items_' + idx} style = {{marginBottom: '1rem'}} >
            <Row type="flex" align="middle" className = {styles.titleRow} >
              <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.onCheck(row)} >
                <img src = {checkIcon} width = {3*config.remSize} height = {3*config.remSize} />
                {/*<Icon type = {checkIcon} style = {{fontSize: '4rem', color: '#BC1E1E'}} />*/}
              </Col>
              <Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
                <font>处方编号</font><br/><span style = {{fontSize: '2rem'}} >{prescriptionId}</span>
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
                <font>开方日期</font><br/><span style = {{fontSize: '2rem'}} >{moment(prescriptionDate).format('YYYY-MM-DD')}</span>
              </Col>
              <Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
                <font>科室</font><br/>{deptName}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
                <font>医生</font><br/>{doctorName}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
                <font>费用类型</font><br/>{typeName}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
                <font>总金额</font><br/><b>{totalAmt.formatMoney()}</b>
              </Col>
              <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.showDetail(idx)} >
                <p>明细</p><Icon type = {visibleIcon} />
              </Col>
            </Row>
            <div className = {styles.detailContainer} style = {detailCntnStyle} >
              <Row>
                <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.detailTitleCol} ><font>序号</font></Col>
                <Col span = {5} className = {listStyles.item + ' ' + styles.detailTitleCol} ><font>费用类型</font></Col>
                <Col span = {8} className = {listStyles.item + ' ' + styles.detailTitleCol} ><font>项目名称</font></Col>
                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>数量</font></Col>
                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>单价</font></Col>
                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>总价</font></Col>
              </Row>
              {
            	  items.map(
                  (itemRow, itemIdx) => {
                    const { index, typeId, typeName, itemName, count, price, totalAmt } = itemRow;
                    return (
                      <Row key = {'_np_item_' + itemIdx} >
                        <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.detailCol} ><font>{index}</font></Col>
                        <Col span = {5} className = {listStyles.item + ' ' + styles.detailCol} ><font>{typeName}</font></Col>
                        <Col span = {8} className = {listStyles.item + ' ' + styles.detailCol} ><font>{itemName}</font></Col>
                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font>{count}</font></Col>
                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font><b>{price.formatMoney()}</b></font></Col>
                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font><b>{totalAmt.formatMoney()}</b></font></Col>
                      </Row>
                    );
                  }
                )
              }
            </div>
          </Card>
        );
      }
    );
  }
}

export default connect(({order, message}) => ({order, message}))(NeedPay);