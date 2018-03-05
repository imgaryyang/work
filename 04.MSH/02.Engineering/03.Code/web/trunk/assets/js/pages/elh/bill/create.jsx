'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';

class Create extends Component {
	constructor (props) {
		super(props);
	}
	
	onSubmit(data){
		let scope = this;
		let fetch = Refetch.post('api/elh/doctor/create', data, {
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
	refreshList(){
		if(this.props.refreshList){
			this.props.refreshList(arguments);
		}
	}
	render () {
		return (
			<div>
	        <Form onSubmit={this.onSubmit.bind(this)}>
	        	<Grid width={1/3}><FormControl type="text" name="name" grid={1/1} label="姓名" /></Grid>
		        <Grid width={1/3}><FormControl type="text" name="gender" grid={1/1} label="性别" /></Grid>
		        <Grid width={1/3}><FormControl type="text" name="jobNum" grid={1/1} label="工号" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="certNum" grid={1/1} label="资格证书号" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="degrees" grid={1/1} label="学历" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="major" grid={1/1} label="专业" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="jobTitle" grid={1/1} label="职称" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="speciality" grid={1/1} label="特长" /></Grid>
		        <Grid width={1/2}><FormControl type="date" name="entryTime" label="入职时间" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="department" grid={1/1} label="所属科室" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="portrait" grid={1/1} label="照片" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="hospital" grid={1/1} label="所属医院" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="isExpert" grid={1/1} label="是否专家" /></Grid>
		        <Grid width={1/2}><FormControl type="date" name="birthday" grid={1/1} label="出生日期" /></Grid>
		        <Grid width={1/2}><FormControl type="date" name="entryDate" grid={1/1} label="从医日期" /></Grid>
		        <Grid width={1/2}><FormControl type="text" name="sortno" grid={1/1} label="排序" /></Grid>
	          <FormSubmit>submit</FormSubmit>
	       </Form>
	       </div>
    );
  }
}
module.exports = Create
