'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';

class BatchEmport extends Component {
	constructor (props) {
		super(props);
		var myDate = new Date();
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1;
		if(month<10) month = '-0'+month;
		this.state = {
			orgId:'4028b8815562d296015562d879fc000b',
			month: year+month,
			template:[
				{id:'1', name:'templat1'},
				{id:'1', name:'templat2'}
			]
		};
	}
	
	onSubmit(data){
		let scope = this;
		console.log(data);
		var postData = new Object();
		postData.orgId = this.state.orgId;
		postData.month = data.month.substring(0,4)+data.month.substring(5,7);
		postData.note = data.note;
		postData.templateId = data.template.split('-')[0];
		postData.template = data.template.split('-')[1];

		console.log(postData);

		let fetch = Refetch.post('api/els/stubbatch/create', postData, {
			catch: 3600,dataType:'json'
		});
		fetch.then(res => {
			if(res.success){
				scope.close();
				scope.refreshList()
			}
			else Modal.alert('保存失败'); 
		});
	}
	
	close(){
		if(this.props.onClose){
			this.props.onClose(arguments);
		}
	}
	onDateChange(value){
		this.setState({ formatValue: value.substring(0,4)+value.substring(5,7) });
	}

	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	render () {
		return (
			<div>
	        <Form style={{marginRight:10}} onSubmit={this.onSubmit.bind(this)}>
	        	<Grid width={1} offset={1/5} style={{textAlign:'left'}}>
		        	<FormControl type="date" name="month" grid={1/1} label="年月" value={this.state.month} format='yyyy-MM'/>
		        </Grid>
		        <Grid width={1} offset={1/5} style={{textAlign:'left'}} >
		        	<FormControl type="select" name="template" grid={1/2} label="模板" data={this.state.template} optionTpl='{name}' valueTpl='{id}-{name}'/>
		        </Grid>
		        <Grid width={1} offset={1/5} style={{textAlign:'left'}}>
		        	<FormControl type="textarea" name="note" grid={1/2} label="备注" rows={5} max={200}/>
		        </Grid>
	        	<Grid width={1/4} offset={1/4}><FormSubmit>下一步</FormSubmit></Grid>
	        	<Grid width={1/4} ><Button status="error" onClick={this.close.bind(this)}>取消</Button></Grid>
	       </Form>
	       </div>);
  }
}

module.exports = BatchEmport;