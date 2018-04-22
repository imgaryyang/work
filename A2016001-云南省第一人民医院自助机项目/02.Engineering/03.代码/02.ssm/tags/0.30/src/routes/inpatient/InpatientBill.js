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

  componentDidMount () {
	  if(this.props.patient.baseInfo.no)this.loadInpatientBill();
  }

  constructor(props) {
    super(props);
    this.loadInpatientBill = this.loadInpatientBill.bind(this);
    this.renderItems        = this.renderItems.bind(this);
    this.renderSubRowTitle  = this.renderSubRowTitle.bind(this);
  }
  
  loadInpatientBill () {
	const { baseInfo } = this.props.patient;
    this.props.dispatch({
      type: 'inpatient/loadBills',
      payload: {
    	  param: {patient:baseInfo }
      },
    });
  }
  
  render() {
    
    const { records,inpatientInfo } = this.props.inpatient;
    if (inpatientInfo && inpatientInfo.inpatientNo ){
    	return (  <Empty info = '暂无正在住院信息！' /> );
    }
    const {
	    medicalRecordId/*病历ID*/,inpatientId/*住院ID*/,inpatientNo/*住院号*/,patientNo/*病人编号*/,
		patientName/*病人姓名*/,deptId/*专科编号*/,deptName/*专科名称*/,wardId/*病区ID*/,
		wardName/*病区名称*/,bedNo/*床位号*/,hospitalArea/*入院院区*/,admission/*入院情况 1:一般 2:差 3:危急*/,
		cardNo/*门诊病历号*/,inDate/*入院时间*/,outDate/*出院时间*/,sex/*病人性别*/,
		status/*状态标志 0:普通 1:挂账 2:呆账 5:特殊回归 7:普通回归 9:病区出院*/,
		idenNo/*身份证号*/,mobile/*联系电话*/,birthday/*出生日期*/,inDiagnoseNo/*入院诊断代码*/,
		inDiagnose/*入院诊断*/,payment/*自付预缴款*/,drId/*主管医生编码*/,drName/*主管医生姓名*/,
		nurId/*病区编码*/,nurName/*病区名称*/,
		nursingLevel/*护理级别 1:I级护理(常规护理)2:I级护理(优质护理)3:II级护理(常规护理)4:II级护理(优质护理)*/,
    } = inpatientInfo;
    
    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem', overflow: 'auto', paddingBottom: '4rem'}} >

        <Card  radius = {false} >
          <Row className = {styles.brief} >
            <Col span = {3} className = {listStyles.title} >姓名</Col>
            <Col span = {5} className = {listStyles.item} >{patientName}</Col>
            <Col span = {3} className = {listStyles.title} >住院号</Col>
            <Col span = {5} className = {listStyles.item} >{inpatientNo}</Col>
            <Col span = {3} className = {listStyles.title} >床位号</Col>
            <Col span = {5} className = {listStyles.item} >{bedNo}</Col>
          </Row>
          <Row className = {styles.brief} >
	        <Col span = {3} className = {listStyles.title} >病区</Col>
	        <Col span = {5} className = {listStyles.item} >{wardName}</Col>
	        <Col span = {3} className = {listStyles.title} >入院日期</Col>
	        <Col span = {5} className = {listStyles.item} >{moment(inDate).format('YYYY-MM-DD')}</Col>
	        <Col span = {3} className = {listStyles.title} >费用截止日期</Col>
	        <Col span = {5} className = {listStyles.item} >{moment(outDate).format('YYYY-MM-DD')}</Col>
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
	const { records  } = this.props.inpatient;
    if (!records || records.length <=0 )return null;
    const map ={};
    const groups=[];
    records.map((row, idx) => {
    	var id = row.itemId;
    	if(!map[id]){
    		map[id] = {itemId:row.itemId,itemName:row.itemName,children:[]};
    		groups.push(map[id]);
    	}
    	map[id].children.push(row);
    });
    return groups.map((group, idx) => {
    	const { itemName } = group;
//      const {
//		recipeNo     /*处方号*/,
//		indeptId     /*专科ID*/,
//		indeptName   /*专科名称*/,
//		doctorId     /*医师ID*/,
//		doctorName   /*医生姓名*/,
//		itemId       /*项目ID*/,
//		itemName     /*项目名称*/,
//		feeType      /*分类码*/,
//		dose         /*剂量*/,
//		frequency    /*频次*/,
//		usage        /*方法*/,
//		dosage       /*每次用量*/,
//		dosageSpec   /*每次用量单位*/,
//		itemPrice    /*单价*/,
//		itemNum      /*数量*/,
//		itemSepc     /*规格*/,
//		paymentStatus/*缴费状态*/,
//		execStatus   /*确认状态*/, 
//     }	= row ;
     return (
            <Card key = {'_inpatient_bill_items_' + idx} radius = {false} className = {styles.rows} >
              <div className = {styles.rowTitle} >
                &nbsp;&nbsp;{itemName}&nbsp;&nbsp;&nbsp;&nbsp;
                
              </div>
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

export default connect(({inpatient,patient}) => ({inpatient,patient}))(InpatientBill);


//合计：<font style = {{color: '#BC1E1E'}} >{itemPrice}</font>&nbsp;&nbsp;

//{this.renderSubRowTitle()}
//{
//  items.map((subRow, subIdx) => {
//    return (
//        <Row key = {'_sub_row_' + subIdx} type="flex" align="middle" className = {styles.subRows} >
//          <Col span = {5} className = {listStyles.item + ' ' + listStyles.nowrap} >
//            {subRow.typeName}&nbsp;{subRow.typeCode}
//          </Col>
//          <Col span = {7} className = {listStyles.item} >
//            {subRow.itemName}
//          </Col>
//          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//            {typeof subRow.price == 'number' ? subRow.price.formatMoney() : null}
//          </Col>
//          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//            {subRow.count}
//          </Col>
//          <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//            {typeof subRow.amt == 'number' ? subRow.amt.formatMoney() : null}
//          </Col>
//          {/*
//            <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//              {typeof subRow.selfPaid == 'number' ? subRow.selfPaid.formatMoney() : null}
//            </Col>
//            <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//              {typeof subRow.bookAmt == 'number' ? subRow.bookAmt.formatMoney() : null}
//            </Col>
//            <Col span = {2} className = {listStyles.item + ' ' + listStyles.amt} >
//              {typeof subRow.reductionAmt == 'number' ? subRow.reductionAmt.formatMoney() : null}
//            </Col>
//          */}
//          
//        </Row>
//      );
//    }
//  )
//}
