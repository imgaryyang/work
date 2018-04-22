import React,{ Component } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card } from 'antd';
import WorkSpace from '../../components/WorkSpace';
import styles from './ReadMiCard.css';
import siCard from '../../assets/guide/si-card-read.gif';
import Confirm from '../../components/Confirm';
class ReadMiCard extends Component {
  constructor (props) {
    super(props);
    this.goToPay = this.goToPay.bind(this);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){
    const { miCardInfo:oldMi } = this.props.patient;
  	const { miCardInfo:nowMi } = next.patient;
	if(!oldMi.state && nowMi.state && nowMi.state=='in' ){//医保卡插入
		this.setState({miModal:false},()=>{
			this.goToPay ();
		});
	}
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
  next(){
  }
  render () {
    return (
    	<WorkSpace width = '100%' height = '50rem' >
    		<div className = {styles.guideTextContainer} >
    			<font className = {styles.guideText} >请插入社保卡</font>
    		</div>
    		<div style = {{height: '30rem', width: '30rem', margin: '3rem auto'}} >
	  			<img alt = "" src = {siCard} className = {styles.guidePic} />
	  		</div>
    	</WorkSpace>
    );	
  }
}  

export default  connect(({patient}) => ({patient}))(ReadMiCard);