import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon,Modal }   from 'antd';
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
import siCard from '../../assets/guide/si-card-read.gif';
class NeedPay extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.onCheck        = this.onCheck.bind(this);
    this.goToPay        = this.goToPay.bind(this);
    this.checkMi = this.checkMi.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
  }
  state = {
	selectedMap : {},
	miModal:false,
	pageNo:1,
	pageSize : 5 ,
  };
  componentWillReceiveProps ( next ) {
    const { miCardInfo:oldMi } = this.props.patient;
  	const { miCardInfo:nowMi } = next.patient;
	if(!oldMi.state && nowMi.state && nowMi.state=='in' ){//医保卡插入
		this.setState({miModal:false},()=>{
			this.goToPay ();
		});
	}
  }
  componentDidMount () {
	const { baseInfo } = this.props.patient;
	if(!baseInfo.no)return;
    this.props.dispatch({
      type: 'deposit/loadFees',
      callback:(fees)=>{
    	  var selectedMap={};
    	  for(var fee of fees){
    		  selectedMap[fee.zh] = fee
    	  }
    	  this.setState({selectedMap});
      }
    });
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  onCheck (item) {
	  const { selectedMap } = this.state;
	  const key = selectedMap[item.zh];
	  if(key){ delete selectedMap[item.zh] }
	  else{ selectedMap[item.zh] = item }
	  this.setState({selectedMap});
  }
  checkMi(){
	var { baseInfo } = this.props.patient;
	console.info("NeedPay.checkMi", baseInfo);
	if(baseInfo.unitCode != '0000'){
		this.setState({miModal:true},()=>{
			this.props.dispatch({
		      type: 'patient/listenMiCard',
		    }); 
		});
	}else{
		this.goToPay ();
	}  
  }
  onCancel(){
	  // 关闭modal 停止监听
	  this.setState({miModal:false},()=>{
		  this.props.dispatch({
		      type: 'patient/closeDevice',
		      payload:{device:"miCard"}
		    }); 
	  });
  }
  goToPay () {
	const { selectedMap } = this.state; 
	const { fees } =  this.props.deposit.consume;
	const selectedFees=[];
	for(var fee of fees){
		if(selectedMap[fee.zh])selectedFees.push(fee);
	}
	var groups = Object.keys(selectedMap)||[];
	this.props.dispatch({
      type: 'deposit/consumePrepaid',
      payload:{fees:selectedFees}
    }); 
  }
  
  render() {
    const btnHeight   = 10 * config.remSize,
          listHeight  = config.getWS().height - 1.5*btnHeight - 2 * config.remSize;
    const modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 4;
    const { fees } =  this.props.deposit.consume;
    const { baseInfo } =  this.props.patient;
    const { selectedMap } = this.state; 
    
    var tip="";
    if(baseInfo.relationType == '01' ){
    	tip="您是医保用户，请准备好医保卡并在交费时插入!";
	} 
    var totalAmt = 0;
    fees.map ( (row, idx) => {
		const {zh,dj,sl,cs} = row;	
		var key = selectedMap[zh];
		//此事即使转换成整数，运算后可能还会小数点
		if( key ) {
			var amt = (sl*100)*(dj*10000)/1000000;
			if(cs)amt =(amt*100 )*(cs*100)/10000;
			totalAmt =( totalAmt*10000+amt*10000)/10000;
			console.info(amt,totalAmt);
		}
	});
    
    const { pageNo,pageSize} = this.state;
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const filteredFees = fees.slice(start,limit); // 输出：2
    
    return (
     fees && fees.length == 0 ? (
        <Empty info = '暂无待缴费项目' />
      ) : (
        <WorkSpace fullScreen = {true} >
	      <Card  radius = {false} style = {{marginBottom: '1rem'}} >
	        <Row className = {styles.footer} >
	          <Col span = {15} className = {styles.tip}>{tip}</Col>
	          <Col span = {5} className = {styles.totalamt} style = {{textAlign: 'right'}} >合计：{parseFloat(totalAmt||0).formatMoney()}</Col>
	          <Col span = {4} className = {styles.buttonContainer}>
	          	<Button text = '去缴费' disabled={totalAmt <= 0} onClick = {this.checkMi} />
	          </Col>
	        </Row>
	      </Card>  
          <div className = {styles.listContainer} style = {{height: listHeight + 'px', paddingTop: '2rem'}} >
            <Card  radius = {false} style = {{marginBottom: '1rem'}} >
	          <Row type="flex" align="middle" className = {styles.titleRow} >
	    		<Col span = {1} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.onCheckAll()} >
	    		</Col>
	    		<Col span = {1} className = {listStyles.item + ' ' + styles.titleCol} >
	    			<font>组</font>
	    		</Col>
	    		<Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
	    		<font>时间</font>
	    		</Col>
	    		<Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
	    		<font>科室</font>
	    		</Col>
	    		<Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
	    		<font>医生</font>
	    		</Col>
	    		<Col span = {5} className = {listStyles.item + ' ' + styles.titleCol} >
	    		<font>费用类型</font>
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    		<font>单价</font>
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    		<font>数量</font>
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    		<font>金额</font>
	    		</Col>
	          </Row>
			</Card>  
            {this.renderItems(filteredFees)}
          </div>
          {
        	  fees.length > pageSize ? (
  	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
  		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
  		            <Col span = {8}>&nbsp;</Col>
  		            <Col span = {8} ><Button text = "下一页" disabled={limit >= fees.length } onClick = {this.nextPage} /></Col>
  	            </Row>
              ):null
          }
          <Modal visible = {this.state.miModal} closable = {false} footer = {null} width = {config.getWS().width * 0.6836 + 'px'} style={{top:modalWinTop+'rem'}} >
	        <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
		        <div className = {styles.guideTextContainer} >
					<font className = {styles.guideText} >请插入社保卡</font>
				</div>	
				<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					<img alt = "" src = {siCard} className = {styles.guidePic} />
				</div>
				<Row style = {{padding : config.navBar.padding + 'rem'}} >
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8}><Button text = "取消"  onClick = {this.onCancel} /></Col>
		            <Col span = {8} >&nbsp;</Col>
	            </Row>
	        </div>
          </Modal>
        </WorkSpace>
      )
    );

  }
  renderItems (fees) {
	  const { selectedMap } = this.state; 
	  return fees.map ( (row, idx) => {
		const {
			zh,/*组号*/
			mc,/*名称*/
			dj,/*单价*/
			sl,/*数量*/
			cs,/* 次数*/
			kzjb,/*控制级别*/
			yzsj,/*医嘱 时间*/
			ysid,/*医生编号*/
			kzjbmc,/*控制级别名称*/
			ysxm,/*医生姓名*/
			ksmc,/*科室名称*/
			ksid,/*科室id*/
			flmmc/*分类码名称*/
		} = row;	
		var key = selectedMap[zh]
		var checkIcon = key?checked:unchecked;
		return (
	      <Card  radius = {false} key = {'_np_items_' + idx} style = {{marginBottom: '1rem'}} >
	        <Row type="flex" align="middle" className = {styles.titleRow} >
	    		<Col span = {1} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.onCheck(row)} >
	    			<img src = {checkIcon} width = {3*config.remSize} height = {3*config.remSize} />
	    		</Col>
	    		<Col span = {1} className = {listStyles.item + ' ' + styles.titleCol} >
	    			<span style = {{fontSize: '2rem'}} >{zh}</span>
	    		</Col>
	    		<Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
	    			<span style = {{fontSize: '2rem'}} >{moment(yzsj).format('YYYY-MM-DD')}</span>
	    		</Col>
	    		<Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
	    			{ksmc}
	    		</Col>
	    		<Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
	    			{ysxm}
	    		</Col>
	    		<Col span = {5} className = {listStyles.item + ' ' + styles.titleCol} >
	    			{flmmc||" "}<br/>({mc})
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    			<b>{dj	.formatMoney(4)}</b>
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    			<b>{sl}</b>
	    		</Col>
	    		<Col span = {2} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
	    			<b>{(sl*dj)/*.formatMoney(4)*/}</b>
	    		</Col>
	          </Row>
			</Card>
		)
	  });
  }
//  renderItems () {
//	const { fees } =  this.props.deposit.consume;
//    return fees.map ( (row, idx) => {
//        const { prescriptionId, prescriptionDate, deptId, deptName, doctorId, doctorName, typeId, typeName, totalAmt, items } = row;
//
//        let detailVisible   = typeof this.state.detailVisible['d_' + idx] == 'undefined' ? this._defaultVisible : this.state.detailVisible['d_' + idx],
//            detailCntnStyle = {
//              display: detailVisible ? 'block' : 'none'
//            },
//            visibleIcon     = detailVisible ? 'caret-up' : 'caret-down',
//            selectedIds     = this.props.order.selectedIds,
//            checkIcon       = selectedIds.indexOf(prescriptionId + ';') == -1 ? unchecked : checked;//'close-circle-o' : 'check-circle-o';
//
//        return (
//          <Card  radius = {false} key = {'_np_items_' + idx} style = {{marginBottom: '1rem'}} >
//            <Row type="flex" align="middle" className = {styles.titleRow} >
//              <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.onCheck(row)} >
//                <img src = {checkIcon} width = {3*config.remSize} height = {3*config.remSize} />
//                {/*<Icon type = {checkIcon} style = {{fontSize: '4rem', color: '#BC1E1E'}} />*/}
//              </Col>
//              <Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
//                <font>处方编号</font><br/><span style = {{fontSize: '2rem'}} >{prescriptionId}</span>
//              </Col>
//              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
//                <font>开方日期</font><br/><span style = {{fontSize: '2rem'}} >{moment(prescriptionDate).format('YYYY-MM-DD')}</span>
//              </Col>
//              <Col span = {4} className = {listStyles.item + ' ' + styles.titleCol} >
//                <font>科室</font><br/>{deptName}
//              </Col>
//              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
//                <font>医生</font><br/>{doctorName}
//              </Col>
//              <Col span = {3} className = {listStyles.item + ' ' + styles.titleCol} >
//                <font>费用类型</font><br/>{typeName}
//              </Col>
//              <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.titleCol} >
//                <font>总金额</font><br/><b>{totalAmt.formatMoney()}</b>
//              </Col>
//              <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.titleCol} onClick = {() => this.showDetail(idx)} >
//                <p>明细</p><Icon type = {visibleIcon} />
//              </Col>
//            </Row>
//            <div className = {styles.detailContainer} style = {detailCntnStyle} >
//              <Row>
//                <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.detailTitleCol} ><font>序号</font></Col>
//                <Col span = {5} className = {listStyles.item + ' ' + styles.detailTitleCol} ><font>费用类型</font></Col>
//                <Col span = {8} className = {listStyles.item + ' ' + styles.detailTitleCol} ><font>项目名称</font></Col>
//                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>数量</font></Col>
//                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>单价</font></Col>
//                <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailTitleCol} ><font>总价</font></Col>
//              </Row>
//              {
//            	  items.map(
//                  (itemRow, itemIdx) => {
//                    const { index, typeId, typeName, itemName, count, price, totalAmt } = itemRow;
//                    return (
//                      <Row key = {'_np_item_' + itemIdx} >
//                        <Col span = {2} className = {listStyles.item + ' ' + listStyles.center + ' ' + styles.detailCol} ><font>{index}</font></Col>
//                        <Col span = {5} className = {listStyles.item + ' ' + styles.detailCol} ><font>{typeName}</font></Col>
//                        <Col span = {8} className = {listStyles.item + ' ' + styles.detailCol} ><font>{itemName}</font></Col>
//                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font>{count}</font></Col>
//                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font><b>{price.formatMoney()}</b></font></Col>
//                        <Col span = {3} className = {listStyles.item + ' ' + listStyles.amt + ' ' + styles.detailCol} ><font><b>{totalAmt.formatMoney()}</b></font></Col>
//                      </Row>
//                    );
//                  }
//                )
//              }
//            </div>
//          </Card>
//        );
//      }
//    );
//  }
}

export default connect(({patient,deposit}) => ({patient,deposit}))(NeedPay);