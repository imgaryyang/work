'use strict';

import {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    Table,
    Modal,
    Button,
    Select,
    Form,
    Input,
    message,
    Icon,
}
from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;

let yearChildren = [];
let monthChildren = [];

let propsForm;
let nowYear;
let nowMonth;

class NewCreateForm extends Component{
	constructor (props) {
		super(props);
		propsForm = this.props.form;
	}
	render () {
		const { getFieldProps } = this.props.form;
		return (
			<Form inline>
				<FormItem label="年份" required>
	    			<Select {...getFieldProps('year',{initialValue:nowYear})} style={{ width: 100 }}>
	    				{yearChildren}
	    		    </Select>
				</FormItem>
				<FormItem label="月份" required>
					<Select {...getFieldProps('month',{initialValue:nowMonth})} style={{ width: 100 }}>
						{monthChildren}
					</Select>
				</FormItem>
				<FormItem label="描述" style={{ marginTop: 10, marginLeft: 10 }}>
					<Input type="textarea" maxLength={200} {...getFieldProps('note',{initialValue:""})} rows={4} style={{ width: 258 }}/>
				</FormItem>
			</Form>
		);
	}
}
const NewForm = createForm()(NewCreateForm);

class List extends Component {
    constructor(props) {
        super(props);

        var time = new Date();
        var startYear = 2014;
        
        nowYear = time.getFullYear();
        nowMonth = time.getMonth();
        
        for (var i = 0; startYear + i <= nowYear; i++) {
        	yearChildren.push(<Option key={startYear + i}>{startYear + i}</Option>);
        }
        
        for (var i = 1; i < 13; i++) {
        	monthChildren.push(<Option key={i}>{i}</Option>);
        }
        
        this.state = {
            filters: [],
            data: [],
            choseYear: nowYear,
            striped: true,
            width: '100%',
            loading: false,
            visible: false
        };
        this.version = props.version;
    }
    
	showLoading(flag){
		this.setState({
			loading: flag,
		});
	}
	
	formatMoney(s, n) {//格式化金额
	    n = n > 0 && n <= 20 ? n: 2;
	    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	    var l = s.split(".")[0].split("").reverse(),
	    r = s.split(".")[1];
	    var t = "";
	    
	    for (var i = 0; i < l.length; i++) {
	        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ",": "");
	    }
	    
	    return t.split("").reverse().join("") + "." + r;
	}
    
    componentWillMount() {
    	
		this.showLoading(true);
		
        let fetch = Ajax.get('api/els/paybatch/list/' + nowYear, null, {catch: 3600});
        fetch.then(res => {
			let data = res.result;
			this.setState({data: data, loading: false, });
	    	return res;
		});
    }
    getColumn() {
        const scope = this;
        return [{
            title: '年月份',
            dataIndex: 'month',
		}, {
			title: '批次号',
			dataIndex: 'batchNo',
		}, {
			title: '总人数',
			dataIndex: 'num',
		}, {
			title: '总金额（元）',
			dataIndex: 'amount',
			render(text,record,index) {
				return <span>{scope.formatMoney(record.amount, 2)}</span>;
			},
		}, {
			title: '发放状态',
			dataIndex: 'state',
			render(text,record,index) {
				var opts=[];
				
				if(record.state == '0')
					opts.push(<span>新建</span>);
				else if(record.state == '1')
					opts.push(<span>审核中</span>);
				else if(record.state == '2')
					opts.push(<span>发放中</span>);
				else if(record.state == '3')
					opts.push(<span>已发放</span>);
				else
					opts.push(<span>关闭</span>);
				
				return <div>{opts}</div>;
			},
		}, {
			title: '发放日期',
			dataIndex: 'payTime',
			render(text,record,index) {
				return (text == '' || text == null)?"未发放":text;
			},
		}, {
			title: '成功发放人数',
			dataIndex: 'succNum',
		}, {
			title: '成功发放金额（元）',
			dataIndex: 'succAmount',
			render(text,record,index) {
				return <span>{scope.formatMoney(record.succAmount, 2)}</span>;
			},
		},{
			title: '操作',
			dataIndex: 'opt',
			render(text, record, index) {
                return <Button onClick={scope.onView.bind(scope,record)} style={{color:'#57c5f7'}} icon="file-text">查看</Button>;
            },
        }];
    }

    onUpload() {
        if (this.props.onUpload) {
            this.props.onUpload(arguments);
        }
    }
    onExport() {
    	window.location.href = "api/els/paypreview/export/"+nowYear;
    }
    onDownload() {
        window.location.href = "api/els/paypreview/download";
    }
    onView(row) {
        if (this.props.onView) {
            this.props.onView(row);
        }
    }

    onDelete(data) {
        var scope = this;
        
        if(data.state != "0"){
        	message.error('此批次信息的状态已经不允许删除任何信息');
        	return;
        }
        
        confirm({
            title: '您是否确认要删除这项内容',
            onOk() {
            	scope.showLoading(true);
                let fetch = Ajax.del('api/els/paybatch/' + data.id, null, {
                    catch: 3600
                });
                fetch.then(res => {
                    if (res.success) {
                        message.success('删除成功');
                        scope.refresh();
                    } else {
                        message.error(res.msg);
                    }
                    scope.showLoading(false);
                    return res;
                });
            },
            onCancel() {},
        });
    }
    onYearChange(data) {
    	
    	this.showLoading(true);
        this.state.choseYear = data;
        nowYear = data;
        let fetch = Ajax.get('api/els/paybatch/list/' + data, null, {
            catch: 3600
        });
        fetch.then(res => {
            let data = res.result,
            total = res.total,
            start = res.start;
            this.setState({
                data: data,
                loading: false,
            });
            return res;
        });
    }

    refresh() {
    	this.componentWillMount();
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk(data) {
    	const scope = this;
		var data;
		propsForm.validateFields((errors, values) => {
			data = values;
		});
		
		nowYear = data.year;
		this.showLoading(true);		
		
    	let fetch = Ajax.post('api/els/paybatch/create', data, {
			catch: 3600,dataType:'json'
		});
    	
		fetch.then(res => {
			if(res.success){
				this.state.choseYear = data.year;
				message.success('新建成功');
				scope.handleCancel();
				scope.onView(res.result);
			}
			else message.error(res.msg);
			
			this.showLoading(false);
		});
		
    }
    handleCancel() {
        this.setState({
            visible: false,
            loading: false,
        });
        propsForm.resetFields();//重置表单数据
    }

    render() {
        let bStyle = {marginRight: '3px',float: 'right'};
        return (
        	<div style = {{minHeight: '500px'}}>
        		<div style = {{backgroundColor: "#dee4e6"}}>
	        		<Select ref="yearSelect" defaultValue={nowYear} value={this.state.choseYear} onChange={this.onYearChange.bind(this)} style={{ width: 100 }}>
	        			{yearChildren}
	        		</Select>
	        		<a style={{ marginLeft: 5,display:'inline'}} onClick={this.refresh.bind(this)}><Icon type="reload" /></a>
					<Button type = "primary" onClick = {this.onDownload.bind(this)} style={bStyle}>下载导入模板</Button>
					<Button type = "primary" onClick = {this.onExport.bind(this)} style = {bStyle}> 导出 </Button>
					<Button type = "primary" onClick = {this.onUpload.bind(this)} style={bStyle}>导入</Button>
					<Button type = "primary" onClick = {this.showModal.bind(this)} style = {bStyle} icon="plus">新建</Button>
				</div>	
		        <Table
		        	columns = {this.getColumn()} 
			        rowKey = {record => record.id}
			        loading = {this.state.loading}
		        	dataSource = {this.state.data}/>
		        <Modal ref = "modal" 
		        	visible = {this.state.visible} title = "新建工资批次" width = "430"
		        	onOk = {this.handleOk.bind(this)} onCancel = {this.handleCancel.bind(this)}>

		        	<div style={{ paddingLeft: 30, paddingRight: 30 }} >
		        		<NewForm/>
					</div>
				</Modal>
		    </div>
		    
        );
    }
}

module.exports = List;