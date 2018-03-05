'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import List from './list.jsx';
import Details from './details.jsx';
import Treatment from './treatment.jsx';
import CheckDetail from './checkDetail.jsx';
import MoreTreat from './moreTreat.jsx';
import MoreCheck from './moreCheck.jsx';

class DoctorMain extends Component {
	
  constructor (props) {
    super(props); 
    this.state={
    	listVersion:1,
    	items:[]
    }
    this.state.items.push(this.getHomeCmp());
  }
  
  getHomeCmp(){
	  let personList=(<List key = 'list' name = '患者管理'  version={this.state.listVersion}
			  onView={this.detailsModel.bind(this)}/>);
	  return personList;
  }

  back(){
	  this.state.items.pop();
	  this.state.listVersion = this.state.listVersion+1;
	  this.setState({items:this.state.items});
  }
  
  refreshList(){
	  this.state.items=[];
	  this.state.items.listVersion++;
	  this.state.items[0] = this.getHomeCmp();
	  this.setState({items:this.state.items,listVersion:this.state.listVersion});
  }
  
  selectCard(card){ 
	  var items=[],i=0;
	  for(i=0;i<this.state.items.length;i++){
		  items.push(this.state.items[i]);
		  if(this.state.items[i].key ==card.key)break;
	  }
	  this.state.items = items;
	  this.setState(this.state.items );
  }

	  
  treatModel(data){
	  this.state.items.push(<Treatment data={data} onCheckDetail={this.checkModel.bind(this)} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'treatmentDis' name = '就诊记录'/>);
	  this.setState(this.state.items);
  }
  
  checkModel(data){
	  this.state.items.push(<CheckDetail data={data} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'checkDetail' name = '报告单'/>);
	  this.setState(this.state.items);
  }
  
  detailsModel(data){
	  this.state.items.push(<Details data={data} onTreatment={this.treatModel.bind(this)} onCheckDetail={this.checkModel.bind(this)} onMoreTreat={this.moreTreatModel.bind(this)} onMoreCheck={this.moreCheckModel.bind(this)} onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'editDoctor' name='患者信息'/>);
	  this.setState(this.state.items);
  }
  
  moreTreatModel(id){
	  this.state.items.push(<MoreTreat id={id} onTreatment={this.treatModel.bind(this)}  onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'moreTreat' name ='更多'/>);
	  this.setState(this.state.items);
  }
  moreCheckModel(){
	  this.state.items.push(<MoreCheck onCheckDetail={this.checkModel.bind(this)}  onClose = {this.back.bind(this)} refreshList={this.refreshList.bind(this)} key = 'moreCheck' name ='更多' />);
	  this.setState(this.state.items);
  }
  
  render () {
	return (
    	<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
    		{this.state.items}
    	</NavCard>
    ) 
  }
}
module.exports =DoctorMain;
