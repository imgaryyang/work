import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, Row, Col} from 'antd';
import WorkSpace from '../../components/WorkSpace';
import Confirm from '../../components/Confirm';
import VerifyAuthCode from '../base/VerifyAuthCode';
import config               from '../../config';

class RealNameCheck extends Component {
  constructor (props) {
	super(props);
    this.onVerfied = this.onVerfied.bind(this);
    this.setLimit = this.setLimit.bind(this);
    this.afterVerfied = this.afterVerfied.bind(this);
    this.realSetLimit = this.realSetLimit.bind(this);
  }
  
  state= { verfied :false,verfyResult:false} ;
  componentDidMount () {
	  const { baseInfo } = this.props.patient;
	  if(!baseInfo.no)return;
	  const { mobile,telephone,idNo,balance,ktfs} = baseInfo;
	  // var phone = telephone ||mobile;
	  var isRealName = (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信    
	  var total = isRealName?config.prepaid.limit:config.prepaid.limit_unReal;
	  if(total > balance)this.setLimit((total*10000-balance*10000)/10000);
		
//	  if(isRealName){//实名用户 ，未超过限额的，设置限额
//		  if(config.prepaid.limit > balance)this.setLimit((config.prepaid.limit*10000-balance*10000)/10000);
//	  }
  } 
  onVerfied(m,verfyResult ){
	this.setState({verfied:true,verfyResult:verfyResult},()=>{
		const { baseInfo } = this.props.patient;
		const { mobile,telephone,idNo,balance,ktfs } = baseInfo;
		// var phone = telephone ||mobile;
		var isRealName = verfyResult || (ktfs == '1' || ktfs == '2');//预存开通方式 0：未任何身份验证 1：身份证2：短信    
		var total = isRealName?config.prepaid.limit:config.prepaid.limit_unReal;
		if(total > balance)this.setLimit((total*10000-balance*10000)/10000);
	});
  }
  setLimit(limit){
//	console.info("设置本次充值的最大额度： ",limit);
//	this.props.dispatch({
//      type: 'payment/setState',
//      payload:{ limit:limit,},
//	  callback:()=>{
//		 console.info("限额设置完毕 ");
//		 this.afterVerfied();
//	  }
//	});
	  setTimeout(()=>{
		  this.realSetLimit(limit);
	  },200);
  }
  realSetLimit(limit){
	console.info("设置本次充值的最大额度： ",limit);
	this.props.dispatch({
      type: 'payment/setState',
      payload:{ limit:limit,},
	  callback:()=>{
		 console.info("限额设置完毕 ");
		 this.afterVerfied();
	  }
	});
  }
  afterVerfied(){
	  if(this.props.afterRealCheck){
		  this.props.afterRealCheck(); 
	  }
  }
  render () {
	const { baseInfo } = this.props.patient;
	const { mobile,telephone,idNo,balance,ktfs } = baseInfo;
	const { verfied, verfyResult } = this.state;
	var phone = telephone ||mobile;
	var isRealName =(  ktfs == '1' || ktfs == '2' );// ( verfied && verfyResult ) || 
	
    return (
    	<WorkSpace style = {{paddingTop: '4rem'}} >
	    {
	    	isRealName?(
	    		<div>
			    	<Card bordered = {true} style = {{margin: '0 2rem 2rem 2rem', textAlign:'center',padding: '2rem', fontSize: '3rem'}} >
				      <div>
				      实名认证过的患者最多可以预存{config.prepaid.limit.formatMoney()}元
				      </div>
				    </Card>
				    <Confirm
				    	info = {'预存金额已超过限额'+(config.prepaid.limit.formatMoney())+'元'} 
				    	visible = {balance>=config.prepaid.limit} 
					    buttons = {[
					     {text: '确定', onClick: () =>{ this.props.dispatch(routerRedux.push('/homepage'));}}
					    ]}
					   />
			    </div>
	    	):(
	    		<div>
			    	<Card bordered = {true} style = {{margin: '0 2rem 2rem 2rem', textAlign:'center',padding: '2rem', fontSize: '3rem'}} >
				      <div>
				      非实名患者最多可以预存{config.prepaid.limit_unReal.formatMoney()}元
				      </div>
				    </Card>
				    <Confirm
				    	info = {'预存金额已超过限额'+(config.prepaid.limit_unReal.formatMoney())+'元'} 
				    	visible = {balance>=config.prepaid.limit_unReal} 
					    buttons = {[
					     {text: '确定', onClick: () =>{ this.props.dispatch(routerRedux.push('/homepage'));}}
					    ]}
					   />
			    </div>
	    	)
	    }
			
		</WorkSpace>
    );	
  }
}  

export default  connect(({deposit,patient}) => ({deposit,patient}))(RealNameCheck);


//<div>
//<Card bordered = {true} style = {{margin: '0 2rem 2rem 2rem', textAlign:'center',padding: '2rem', fontSize: '3rem'}} >
//  <div>
//  您还未进行过实名认证，请验证您的手机号<br/>如果您选择跳过，您最多可以预存{config.prepaid.limit_unReal.formatMoney()}元
//  </div>
//</Card>
//<VerifyAuthCode onVerfied={this.onVerfied} type= 'DEP' canSkip={true} mobile={phone}/>
//<Confirm 
//	info = {'预存金额已超过限额'+(config.prepaid.limit_unReal.formatMoney())+'元'} 
//	visible = { verfied && balance>=config.prepaid.limit_unReal} 
//    buttons = {[ {text: '确定', onClick: () =>{ this.props.dispatch(routerRedux.push('/homepage'));}}]}
//  />
//</div>