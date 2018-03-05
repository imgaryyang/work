'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';

class Editor extends Component {
  constructor (props) {
    super(props);
  }
 
  onSubmit(data){
	  console.info('editor onSubmit',Refetch.post,JSON.stringify(data));
		let scope = this;
		let fetch = Refetch.put('api/elh/doctor/'+data.id, data, {
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
        <h2>React UI Form demo</h2>
        <Form onSubmit={this.onSubmit.bind(this)}>
        	<div style={{ display: 'none'}}><FormControl type="text" name="id" value={this.props.data.id}/></div>
        	<Grid width={1/2}><FormControl type="text" name="name" grid={1/1} label="姓名" value={this.props.data.name}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="gender" grid={1/1} label="性别" value={this.props.data.gender}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="jobNum" grid={1/1} label="工号" value={this.props.data.jobNum}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="certNum" grid={1/1} label="资格证书号" value={this.props.data.certNum}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="degrees" grid={1/1} label="学历" value={this.props.data.degrees}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="major" grid={1/1} label="专业" value={this.props.data.major}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="jobTitle" grid={1/1} label="职称" value={this.props.data.jobTitle}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="speciality" grid={1/1} label="特长" value={this.props.data.speciality}/></Grid>
	        <Grid width={1/2}><FormControl type="date" name="entryTime" label="入职时间" value={this.props.data.entryTime}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="department" grid={1/1} label="所属科室" value={this.props.data.department}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="portrait" grid={1/1} label="照片" value={this.props.data.portrait}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="hospital" grid={1/1} label="所属医院" value={this.props.data.hospital}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="isExpert" grid={1/1} label="是否专家" value={this.props.data.isExpert}/></Grid>
	        <Grid width={1/2}><FormControl type="date" name="birthday" grid={1/1} label="出生日期" value={this.props.data.birthday}/></Grid>
	        <Grid width={1/2}><FormControl type="date" name="entryDate" grid={1/1} label="从医日期" value={this.props.data.entryDate}/></Grid>
	        <Grid width={1/2}><FormControl type="text" name="sortno" grid={1/1} label="排序" value={this.props.data.sortno}/></Grid>
          <FormSubmit>submit</FormSubmit>
        </Form>
      </div>
    );
  }
}
module.exports = Editor;