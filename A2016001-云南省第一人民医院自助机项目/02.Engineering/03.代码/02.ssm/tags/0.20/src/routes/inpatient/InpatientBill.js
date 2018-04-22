import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InpatientBill.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';

class InpatientBill extends React.Component {

  static displayName = 'InpatientBill';
  static description = '住院费用查询';

  static propTypes = {
  };

  static defaultProps = {
  };

  componentWillMount () {
	  this.loadInpatientBill();
  }

  constructor(props) {
    super(props);
    this.loadInpatientBill = this.loadInpatientBill.bind(this);
    this.renderItems        = this.renderItems.bind(this);
    this.renderSubRowTitle  = this.renderSubRowTitle.bind(this);
  }
  
  loadInpatientBill () {
    this.props.dispatch({
      type: 'inpatient/loadInpatientBill',
      payload: {
      },
    });
  }
  
  render() {
    
    const { InpatientInfo, InpatientInfoLoaded, InpatientAdmissionDate } = this.props.inpatient;
    if (InpatientInfoLoaded === true && !InpatientInfo.inpatientId)
      return (
        <Empty info = '暂无正在住院信息！' />
      );
    
    const { inpatientId, bedArea, bedNo, inpatientName, billStartDate, billEndDate, totalAmt, totalSelfPaid, totalBookAmt, totalReductionAmt } = InpatientInfo;
    
    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem', overflow: 'auto', paddingBottom: '4rem'}} >

        <Card shadow = {true} radius = {false} >
          <Row className = {styles.brief} >
            <Col span = {2} className = {listStyles.title} >姓名</Col>
            <Col span = {2} className = {listStyles.item} >{inpatientName}</Col>
            <Col span = {2} className = {listStyles.title} >住院号</Col>
            <Col span = {1} className = {listStyles.item} >{inpatientId}</Col>
            <Col span = {2} className = {listStyles.title} >病区</Col>
            <Col span = {2} className = {listStyles.item} >{bedArea}</Col>
            <Col span = {2} className = {listStyles.title} >床位号</Col>
            <Col span = {2} className = {listStyles.item} >{bedNo}</Col>
            <Col span = {3} className = {listStyles.title} >费用日期</Col>
            <Col span = {6} className = {listStyles.item + ' ' + listStyles.nowrap} >{moment(billStartDate).format('YYYY-MM-DD') + '~' + moment(billEndDate).format('YYYY-MM-DD')}</Col>
          </Row>
          <Row className = {styles.total} >
            <Col span = {3} className = {listStyles.title} >合计总金额</Col>
            <Col span = {3} className = {listStyles.item} >{typeof totalAmt == 'number' ? totalAmt.formatMoney() : null}</Col>
            {/*
            	 <Col span = {3} className = {listStyles.title} >合计自付金额</Col>
                 <Col span = {3} className = {listStyles.item} >{typeof totalSelfPaid == 'number' ? totalSelfPaid.formatMoney() : null}</Col>
                 <Col span = {3} className = {listStyles.title} >合计记账金额</Col>
                 <Col span = {3} className = {listStyles.item} >{typeof totalBookAmt == 'number' ? totalBookAmt.formatMoney() : null}</Col>
                 <Col span = {3} className = {listStyles.title} >合计减免金额</Col>
                 <Col span = {3} className = {listStyles.item} >{typeof totalReductionAmt == 'number' ? totalReductionAmt.formatMoney() : null}</Col>
            */}
          </Row>
        </Card>

        {this.renderItems()}

      </WorkSpace>
    );
  }

  renderItems () {
    if (!this.props.inpatient.InpatientBill)
      return null;
    else
      return this.props.inpatient.InpatientBill.map (
        (row, idx) => {
          const { feeTypeName, totalAmt, totalSelfPaid, items } = row;

          return (
            <Card key = {'_inpatient_bill_items_' + idx} shadow = {true} radius = {false} className = {styles.rows} >
              <div className = {styles.rowTitle} >
                &nbsp;&nbsp;{feeTypeName}&nbsp;&nbsp;&nbsp;&nbsp;
                合计：<font style = {{color: '#BC1E1E'}} >{totalAmt.formatMoney()}</font>&nbsp;&nbsp;
                {/*自费合计：<font style = {{color: '#BC1E1E'}} >{totalSelfPaid.formatMoney()}</font>*/}
              </div>
              {this.renderSubRowTitle()}
              {
                items.map(
                  (subRow, subIdx) => {
                    return (
                      <Row key = {'_sub_row_' + subIdx} type="flex" align="middle" className = {styles.subRows} >
                        <Col span = {5} className = {listStyles.item + ' ' + listStyles.nowrap} >
                          {subRow.typeName}&nbsp;{subRow.typeCode}
                        </Col>
                        <Col span = {7} className = {listStyles.item} >
                          {subRow.itemName}
                        </Col>
                        <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                          {typeof subRow.price == 'number' ? subRow.price.formatMoney() : null}
                        </Col>
                        <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                          {subRow.count}
                        </Col>
                        <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                          {typeof subRow.amt == 'number' ? subRow.amt.formatMoney() : null}
                        </Col>
                        {/*
                          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                            {typeof subRow.selfPaid == 'number' ? subRow.selfPaid.formatMoney() : null}
                          </Col>
                          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                            {typeof subRow.bookAmt == 'number' ? subRow.bookAmt.formatMoney() : null}
                          </Col>
                          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
                            {typeof subRow.reductionAmt == 'number' ? subRow.reductionAmt.formatMoney() : null}
                          </Col>
                        */}
                        
                      </Row>
                    );
                  }
                )
              }
            </Card>
          );
        }
      );
  }

  renderSubRowTitle () {
    return (
      <Row className = {styles.subRowsTitle} >
        <Col span = {5} className = {listStyles.title} >类别</Col>
        <Col span = {7} className = {listStyles.title} >项目</Col>
        <Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >单价</Col>
        <Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >数量</Col>
        <Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >总额</Col>
        {/*
        	<Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >自付金额</Col>
            <Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >记账金额</Col>
            <Col span = {2} className = {listStyles.title + ' ' + listStyles.amt} >减免金额</Col>
        */}
      </Row>
    );
  }

}

export default connect(({inpatient, message}) => ({inpatient, message}))(InpatientBill);





