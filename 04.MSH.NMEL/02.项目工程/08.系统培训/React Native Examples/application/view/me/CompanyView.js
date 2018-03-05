'use strict';

var React = require('react-native');
var NavBar = require('../NavBar');
var Global = require('../../Global');
var Icon = require('react-native-vector-icons/Ionicons');
var CompanyEdit = require('./CompanyEdit');

var UtilsMixin = require('../lib/UtilsMixin');
var TimerMixin = require('react-timer-mixin');

var {
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
    PixelRatio,
	TouchableOpacity,
	Navigator,
	Dimensions,
	TextInput,
	AsyncStorage,
	Alert,
	InteractionManager,
} = React;

var FIND_COMPANY = 'company/find';

var CompanyView = React.createClass({

	mixins: [UtilsMixin, TimerMixin],

    statics: {
        title: 'CompanyView',
        description: '企业信息',
    },

    labels: {
    	'name': '名称',
    	'licnum': '营业执照代码',
    	'brccode': '组织结构代码',
    	'phone': '电话',
    	'fax': '传真',
    	'address': '地址',
    },

	getInitialState:function(){
		return{
			doRenderScene: false,
			value: {},
			valueMap: [],
			noCompany: true,
		};
	},

	componentDidMount: function() {
		console.log(Global.USER_LOGIN_INFO);
		InteractionManager.runAfterInteractions(() => {
			this.fetchData();
			//this.setState({doRenderScene: true});
		});
	},

	fetchData: async function() {
		this.showLoading();
		try {
			let responseData = await this.request(
				Global.host + FIND_COMPANY, 
				{
					body: JSON.stringify({
						id: Global.USER_LOGIN_INFO.id
					}),
				}
			);
			console.log(responseData);
			if(responseData.body) {
				let v = Object.keys(responseData.body).map(value => {
			        return {
			            key: value,
			            label: this.labels[value],
			            text: responseData.body[value],
			        };
			    });
			    this.setState({
			    	value: responseData.body,
			    	valueMap: v,
			    	noCompany: false,
			    	doRenderScene: true,
			   	});
			} else {
				this.setState({
					noCompany: true,
					doRenderScene: true,
				});
			}
			this.hideLoading();
		} catch(e) {
			this.requestCatch(e);
		}
	},

	companyEdit: function(){
		if(Global.USER_LOGIN_INFO.Employees){
			Alert.alert('警告：','由于您已经是其他公司员工，不能申请成为企业主！');
			return;
		}
		this.props.navigator.push({
			title: '编辑企业信息',
            component: CompanyEdit,
            passProps: {
	        	refresh: this.refresh,
	        	name: this.state.value.name,
	        	licnum: this.state.value.licnum,
	        	brccode: this.state.value.brccode,
	        	phone: this.state.value.phone,
	        	fax: this.state.value.fax,
	        	address: this.state.value.address,
	        	id: this.state.value.id,
	        	owner: Global.USER_LOGIN_INFO.id,
        	},
		})
	},

	refresh: function(){
		//console.log("...... CompanyView refresh....");
		this.fetchData();
	},

	render:function(){
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		var noCompany = null, btnText = '编辑企业信息';
		if(this.state.noCompany) {
			noCompany = (
				<View style={styles.list} >
					<View style={[Global.styles.CENTER, {flex: 1, height: 50, flexDirection: 'row'}]}>
						<Text style={{flex: 1, textAlign: 'center'}} >您还未申请成为企业主</Text>
					</View>
					<View style={Global.styles.FULL_SEP_LINE} ></View>
				</View>
			);
			btnText = '申请企业主认证';
		}

		var list = null, rows = null;
		if(!this.state.noCompany) {
			rows = this.state.valueMap.map(
				({key, label, text}, idx) => {
					return this.labels[key] ? (
						<View key={key} >
							<TouchableOpacity key={key} style={styles.item}>
								<Text style={[styles.itemTitle]}>{label}</Text>
								<Text style={[styles.itemTextContent]} >{text}</Text>
							</TouchableOpacity>
							<View style={Global.styles.FULL_SEP_LINE} ></View>
						</View>
					) : null;
				}
			);

			list = (
				<View style={styles.list} >
					{rows}
				</View>
			);
		}

		return(
			<View style={Global.styles.CONTAINER} >
			<ScrollView style={styles.sv}>
				<View style={styles.paddingPlace} />
					<View style={Global.styles.FULL_SEP_LINE} ></View>

                    {list}
                    {noCompany}

					<View style={Global.styles.PLACEHOLDER20} />

			    	<TouchableOpacity 
						style={[Global.styles.BLUE_BTN, {marginLeft: 20, marginRight: 20}]} 
						onPress={this.companyEdit}>
			    		<Text style={{color: '#ffffff',}}>{btnText}</Text>
			    	</TouchableOpacity>

					<View style={Global.styles.PLACEHOLDER40} />

				</ScrollView>
			</View>
		);
	},

	_renderPlaceholderView: function() {
		return (
			<View style={Global.styles.CONTAINER} />
		);
	},

});
var styles = StyleSheet.create({
	paddingPlace: {
		flex: 1,
		height: Global.NBPadding + 20 ,
	},

	list: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	item: {
		width: Global.screen.width,
		flex: 1,
        flexDirection: 'row',
        padding: 12,
        paddingLeft: 15,
        paddingRight: 15,
	},
	itemTitle: {
		width: 100,
	},
	itemTextContent: {
		flex: 1,
		color: Global.colors.IOS_GRAY_FONT,
		fontSize: 13,
	},

});

module.exports = CompanyView;

