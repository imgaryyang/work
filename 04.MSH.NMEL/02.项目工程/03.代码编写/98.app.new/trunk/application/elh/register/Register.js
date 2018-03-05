'use strict';

import React, {
    Component,

} from 'react';

import {
	Animated,
	ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ListView,
	InteractionManager,
	TextInput,
} from 'react-native';

import * as Global  	from '../../Global';
import NavBar			from 'rn-easy-navbar';
// import EasyIcon     	from 'rn-easy-icon';
import EasyPicker   	from 'rn-easy-picker';
import Card       		from 'rn-easy-card';
import {B, I, U, S} 	from 'rn-easy-text';

import ChoosePat    from './ChoosePat.js';

const FIND_HOSP_URL = 'elh/hospital/app/list/0/10';
const FIND_DEPT_URL = 'elh/department/app/list/0/10';
const FIND_REG_URL 	= 'elh/treat/reg/sources/realtime';

class Register extends Component {

    static displayName = 'Register';
    static description = '挂号';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}),

		hospDataSource: [],
		deptDataSource: [],
		epDefault: '',
		epDeptDefault: '',
		epDefaultId: '',
        epDeptDefaultId: '',
	};

	/**
	*会用到props需在此bind
	*例   this.refresh 		= this.refresh.bind(this);
	*/
    constructor (props) {
        super(props);
        this.doReg 			= this.doReg.bind(this);
        this.renderItem 	= this.renderItem.bind(this);
    }

    //初始化
	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
		this.fetchData();
	}

	async fetchData () {
		this.showLoading();
		this.setState({
			loaded: false,
			fetchForbidden: false,
		});
		try {
			var data = "{}";
			data = encodeURI(data);
			let responseData = await this.request(Global._host + FIND_HOSP_URL, {
					method: 'GET'
				});
			this.setState({
				hospDataSource: responseData.result,
				epDefault: responseData.result[0].name,
				epDefaultId: responseData.result[0].id,
			});
			
			var data1 = "{}";
			data1 = encodeURI(data1);
			let responseData1 = await this.request(Global._host + FIND_DEPT_URL+"?"+"data="+data1, {
					method: 'GET'
				});
			this.setState({
				deptDataSource: responseData1.result,
				epDeptDefault: responseData1.result[0].name,
				epDeptDefaultId: responseData1.result[0].id,
				loaded: true,
			});
			this.queryRegRec(this.state.epDefaultId, this.state.epDeptDefaultId);

		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	async queryRegRec (hospId, deptId) {
		try{
			let data =  encodeURI(JSON.stringify({
					hospital: this.state.epDefaultId,
	                department: this.state.epDeptDefaultId,
	                regType: '1',
				}));
			let responseRegData = await this.request(Global._host + FIND_REG_URL+"?"+"data="+data, {
					method: 'GET'
				});
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(responseRegData.result),
				loaded: true,
			});
			this.hideLoading();
		} catch(e) {
			this.hideLoading();
			this.handleRequestException(e);
		}
	}

	doReg (id) {
        this.props.navigator.push({
            title: "选择就诊卡",
            component: ChoosePat,
            passProps: {
            	id: id,
            	refresh: this.refresh,
            	backRoute: this.props.route,
            },
            hideNavBar: true,
        });
    }
	
	render () {
		var listView = null;
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var refreshText = this.state.fetchForbidden === true ? 
			'您还未登录，登录后点击此处刷新数据' : 
			'暂无符合条件的数据，点击此处重新载入';

		var SIStyleIOS = Global._os === 'ios' ? Global._styles.TOOL_BAR.SEARCH_INPUT_IOS : {};

    	var itemArray = [];
    	var hospName = '';
    	var hospId = '';
    	var deptItemArray = [];
    	var deptName = '';
    	var deptId = '';
    	var deptId2 = '';
        var hospId2 = '';
    	var hospId1 = this.state.epDefaultId;
      	var deptId1 = this.state.epDeptDefaultId;
    	for (var i = 0; i < this.state.hospDataSource.length; i++) {
    		hospName = this.state.hospDataSource[i].name;
    		hospId = this.state.hospDataSource[i].id;
      		itemArray.push({label: hospName, value: hospId});
    	}
    	for (var i = 0; i < this.state.deptDataSource.length; i++) {
    		deptName = this.state.deptDataSource[i].name;
    		deptId = this.state.deptDataSource[i].id;
      		deptItemArray.push({label: deptName, value: deptId});
    	}

    	var hospView = this.props.hospitalId === undefined ? (
    		<View style = {styles.inputHolder} >
					<EasyPicker 
							ref = {(c) => this.easyPicker = c}
							dataSource = {itemArray}
							selected = {this.state.epSelected}
							onChange = {(selected) => {
								this.setState({
									epSelected: selected ? selected.value : null,
	                                epSelectedLal: selected ? selected.label : null,
	                                epDefaultId: selected ? selected.value : hospId1,
								});
								hospId2 = selected ? selected.value : hospId1;
                            	this.queryRegRec(hospId2, deptId1);
							}}/>
		        		<Text style={{marginLeft: 10, fontSize: 15, }} >医院：</Text>
						<TextInput style={[Global._styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 40}]} defaultValue={this.state.epDefault} value={this.state.epSelectedLal} 
						onChangeText={(value)=>{this.setState({epSelected: value})}}
							onFocus={() => console.log(this.easyPicker.toggle())}  />				            
				</View>) : null;
    	
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<Card radius = {6} style = {{margin: 8, marginTop: 16}} >
					{hospView}
					<View style = {{height: 1 / Global._pixelRatio, backgroundColor: Global._colors.IOS_SEP_LINE}} />
					<View style = {styles.inputHolder}>
						<EasyPicker 
								ref = {(c) => this.easyPicker1 = c}
								dataSource = {deptItemArray}
								selected = {this.state.epDeptSelected}
								onChange = {(selected) => {
									this.setState({
										epDeptSelected: selected ? selected.value : null ,
			                            epDeptSelectedLal: selected ? selected.label : null,
			                            epDeptDefaultId: selected ? selected.value : deptId1,
									});
									deptId2 = selected ? selected.value : deptId1;
	                            	this.queryRegRec(hospId1, deptId2);
								}}/>
			        		<Text style={{marginLeft: 10, fontSize: 15, }} >科室：</Text>
							<TextInput style={[Global._styles.FORM.NO_BORDER_TEXT_INPUT, {flex: 1, height: 40}]} defaultValue={this.state.epDeptDefault} value={this.state.epDeptSelectedLal} 
							onChangeText={(value1)=>{this.setState({epDeptSelected: value1})}}
								onFocus={() => console.log(this.easyPicker1.toggle())}  />
					</View>
				</Card>
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true} >
					<ListView
						key = {this.data}
				        dataSource = {this.state.dataSource}
				        renderRow = {this.renderItem}
				        enableEmptySections = {true} />
					<View style = {Global._styles.PLACEHOLDER20} />
				</ScrollView>
			</View>
		);
	}

	renderItem (item, sectionID, rowID, highlightRow) {
            
        
		return (
			<View >
				<TouchableOpacity  onPress = {()=>{this.doReg(item.id);}}>
					<View style = {{marginLeft: 8,marginRight:8, marginBottom: 0}} >
						<Card radius = {6} style = {styles.card}>
							<View style = {[Global._styles.CENTER, styles.item]}>
							<View style = {[{flex:1,}]}>
								<Text style = {{ marginLeft: 10, fontSize: 15,}}>{item.noon ? (item.noon == 'am' ? '上午' : '下午') : '' }</Text>
								<Text style = {{marginTop:6, marginLeft: 10, fontSize: 13,}}>{item.type}</Text>
							</View>
							<View style = {[{flex:1, alignItems: 'center'}]}>
								<Text style = {{width: 70, fontSize: 15, color: Global._colors.FONT_GRAY}}>剩余：<B>{item.last}</B></Text>
								<Text style = {{width: 70, fontSize: 15, color: Global._colors.FONT_LIGHT_GRAY1}}>可挂：<B>{item.total}</B></Text>
							</View>
							<View style = {[{flex: 1, alignItems: 'flex-end'}]}>
								<Text style = {{color:Global._colors.FONT_LIGHT_GRAY1, fontSize: 12}}>挂号费</Text>
								<Text style = {{color:Global._colors.FONT_GRAY, fontSize: 22}}>{item.amt}</Text>
							</View>
							<EasyIcon name = 'ios-arrow-forward-outline' size = {18} color = {Global._colors.IOS_ARROW} style = {[{marginLeft:10, width: 20}]} />
							</View>
						</Card>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '挂号' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
	list: {
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.getScreen().width,
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 0,
        paddingRight: 20,
	},
	portrait: {
		width: 40,
		height: 40,
        borderRadius: 20,
        marginLeft: 20,
	},
	card: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0,
		marginTop: 5,
	},
	inputHolder: {
        flexDirection: 'row',
        /*borderBottomWidth: 1 / Global._pixelRatio,
        borderBottomColor: Global._colors.IOS_SEP_LINE,*/
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Register;

