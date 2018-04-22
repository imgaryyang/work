import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InpatientDailyBill.css';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';
import ToolBar              from '../../components/ToolBar';
import InpatientCalendar    from '../../components/InpatientCalendar';
import Month                from '../../components/Month';
import calendarIcon         from '../../assets/base/calendar.png';

class InpatientDailyBill extends React.Component {
  
  constructor(props) {
    super(props);
    this.loadBills = this.loadBills.bind(this);
    this.renderItems      = this.renderItems.bind(this);
    this.openCalendarWin = this.openCalendarWin.bind(this);
    this.onSelectDate   = this.onSelectDate.bind(this);
    this.preDay           = this.preDay.bind(this);
    this.nextDay          = this.nextDay.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
  }
  
  weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;
  
  state = {
    selectedDate: moment(new Date()).format('YYYY-MM-DD'),
    showCalendar: false,
    pageNo:1,
	pageSize : 8  ,
  };
  
  componentDidMount () {
	const { baseInfo } = this.props.patient;
	if(!baseInfo.no)return;
	// const { selectedDate } = this.state;
    this.props.dispatch({
	  type: 'inpatient/loadInpatient',
	  payload: {
		param: {patientNo:baseInfo.no} 
	  },
	});
  }
  componentWillReceiveProps(next) {
	  const { inpatientInfo : old } = this.props.inpatient;
	  const { inpatientInfo : now } = next.inpatient;
	  if(!old.inpatientId && now.inpatientId){//基本信息加载完毕
		  const endDate = now.outDate?moment(now.outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
		  this.setState({selectedDate:endDate},this.loadBills);
	  }
  }
  loadBills () {
	const { selectedDate } = this.state;
    this.props.dispatch({
	  type: 'inpatient/loadBills',
	  payload: {
		param: {
			beginDate:selectedDate+" 00:00:00",
			endDate:selectedDate+" 23:59:59",
		} 
	  },
	}); 
  }

  openCalendarWin () {
    this.setState({showCalendar: true});
  }

  onSelectDate (d) {
	var date = moment(d).format('YYYY-MM-DD');
	this.setState({selectedDate:date,showCalendar:false},this.loadBills);
  }

  preDay () {
	  var date = moment(this.state.selectedDate).add('d',-1).format('YYYY-MM-DD');
	  this.setState({selectedDate:date},this.loadBills);
  }

  nextDay () {
	  var date = moment(this.state.selectedDate).add( 'd',1).format('YYYY-MM-DD');
	  this.setState({selectedDate:date},this.loadBills);
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  render() {
    const { records,inpatientInfo } = this.props.inpatient;
    if (inpatientInfo && inpatientInfo.inpatientNo ){
      return (  <Empty info = '暂无正在住院信息！' /> );
    }
    const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	
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
    
    const { selectedDate } = this.state;
    const endDate = outDate?moment(outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    const startDate = inDate?moment(inDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    
    var canNext = selectedDate < endDate ;
    var canPre = selectedDate > startDate ;
    
    return (
      <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >

        <ToolBar style = {{paddingTop: '10px'}} >
          <Row className = {styles.toolBarItems} >
            <Col span = {8} className = {styles.toolBarItem} >
              <Button text = "前一天" disabled={!canPre} onClick = {this.preDay} />
            </Col>
            <Col span = {8} className = {styles.toolBarItem + ' ' + styles.date} >
              <Card  onClick = {this.openCalendarWin} >
                <img src = {calendarIcon} />{this.state.selectedDate}
              </Card>
            </Col>
            <Col span = {8} className = {styles.toolBarItem} >
              <Button text = "后一天" disabled={!canNext} onClick = {this.nextDay} />
            </Col>
          </Row>
        </ToolBar>

        <Card  radius = {false} >
          <Row>
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
	        <Col span = {3} className = {listStyles.title} >费用日期</Col>
	        <Col span = {5} className = {listStyles.item} >{moment(endDate).format('YYYY-MM-DD')}</Col>
	      </Row>
        </Card>

        <Row>
          <Col span = {8} className = {listStyles.title} >收费项目/（规格）</Col>
          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >单价</Col>
          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >数量</Col>
          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >金额</Col>
          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >缴费状态</Col>
        </Row>
        <Card  radius = {false} className = {styles.rows} >
          {this.renderItems()}
        </Card>
        {
       	 records.length > pageSize ? (
 	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
 		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
 		            <Col span = {8}>&nbsp;</Col>
 		            <Col span = {8} ><Button text = "下一页" disabled={limit >= records.length } onClick = {this.nextPage} /></Col>
 	            </Row>
             ):null
         }
        <Modal visible = {this.state.showCalendar} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
	      <div>
		    <Month width = {this.weekWinWidth - 32} initDate = {selectedDate} onSelectDay = {this.onSelectDate} />
	      </div>
	    </Modal>
      </WorkSpace>
    );
  }
  renderItems () {
    const { records  } = this.props.inpatient;
    if (!records || records.length <=0 )return null;
    
    const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const data = records.slice(start,limit); 
	
    return data.map((row, idx) => {
      let {
		recipeNo     /*处方号*/,
		indeptId     /*专科ID*/,
		indeptName   /*专科名称*/,
		doctorId     /*医师ID*/,
		doctorName   /*医生姓名*/,
		itemId       /*项目ID*/,
		itemName     /*项目名称*/,
		feeType      /*分类码*/,
		dose         /*剂量*/,
		frequency    /*频次*/,
		usage        /*方法*/,
		dosage       /*每次用量*/,
		dosageSpec   /*每次用量单位*/,
		itemPrice    /*单价*/,
		itemNum      /*数量*/,
		itemSepc     /*规格*/,
		paymentStatus/*缴费状态*/,
		execStatus   /*确认状态*/, 
      } = row ;
      itemPrice = itemPrice||0;
      itemNum = itemNum||0;
      itemSepc = itemSepc?"("+itemSepc+")":"";
      const state = {'1':'收费','2':'已退','9':'退费'} 
      return (
    		  <div key = {'_daily_bill_items_' + idx} className = {styles.row} >
	              <Row type="flex" align="middle" >
	                <Col span = {8} className = {listStyles.item} >{itemName}{itemSepc}</Col>
	                <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {itemPrice.formatMoney()}
	                </Col>
	                <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {itemNum}
	                </Col>
	                <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
	                  {(itemPrice*itemNum).formatMoney() }
	                </Col>
	                <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >
	                  {state[paymentStatus]||""}
	                </Col>
	              </Row>
	            </div>
	          );
	        }
      );
  }
}

export default connect(({inpatient,patient}) => ({inpatient,patient}))(InpatientDailyBill);





