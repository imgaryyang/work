'use strict';

import React, {
    Component,

} from 'react';

import {
	Animated,
	StyleSheet,
	ScrollView,
	View,
	Text,
	Image,
	TouchableOpacity,
	InteractionManager,
} from 'react-native';


import NavBar 		from 'rn-easy-navbar';
// import EasyIcon     from 'rn-easy-icon';
import * as Global 	from '../Global';

/**
 * 初始家庭及账号数据
 */
const homes = [
	{name: '我家', city: '呼和浩特', address: '呼和浩特天佑花园16号楼3门502', accounts: [{type: 'water', code:'060267276', unit:'北京市自来水集团',},{type: 'fire', code:'731231201', unit:'北京市燃气公司',}]},
	{name: '父母', city: '包头', address: '包头国际新城北区21号8-901', accounts: []},
	{name: '公司', city: '呼和浩特', address: '呼和浩特市和林县金盛路盛乐企业总部', accounts: []},
];

/**
 * 系统提供的费种类型
 */
const feeTyes = [
	{name: '水费', 		type:'water',		icon: 'ios-water', 		iconLib: 'ii', size: 25, color: '#ff6666'},
	{name: '电费', 		type:'bolt',		icon: 'ios-bulb', 		iconLib: 'ii', size: 25, color: '#ffcf2f'},
	{name: '燃气费', 	type:'fire',		icon: 'md-flame', 		iconLib: 'ii', size: 25, color: '#8b8ffa'},
	{name: '有线电视', 	type:'tv',			icon: 'tv', 			iconLib: 'fa', size: 16, color: '#4dc7ee'},
	{name: '教育缴费', 	type:'graduation',	icon: 'graduation-cap', iconLib: 'fa', size: 18, color: '#2bd3c2'},
	{name: '物业费', 	type:'house',		icon: 'home', 			iconLib: 'fa', size: 20, color: '#ff80c3'},
];

class Home extends Component {


    static displayName = 'Home';
    static description = '缴费主页';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		loading: false,
		homes: homes,
		idx: 0,
		isFolded: true,
	};

    constructor (props) {
        super(props);

        this.fetchData 		= this.fetchData.bind(this);
        this._renderHome 	= this._renderHome.bind(this);
        this._renderAddress = this._renderAddress.bind(this);
        this._renderAccount = this._renderAccount.bind(this);

        this.onPressHomeAdd 	= this.onPressHomeAdd.bind(this);
        this.onPressHomeItem 	= this.onPressHomeItem.bind(this);
        this.onPressUnFolded 	= this.onPressUnFolded.bind(this);
        this.onPressAccount 	= this.onPressAccount.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchData () {
		if(this.state.loading)
			return;

		this.setState({loading: true});
		try {

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	/**
	 * 点击添加家庭按钮
	 */
    onPressHomeAdd (item) {
		this.toast('家庭数量已达上限！');
	}

	/**
	 * 选中家庭
	 */
	onPressHomeItem (idx) {
    	
		this.setState({
			idx: idx,
			isFolded: true,
		});
    }

    /**
	 * 展开所有缴费账户
	 */
    onPressUnFolded () {
    	
		this.setState({
			isFolded: false,
		});
    }

     /**
	 * 点击账户
	 */
    onPressAccount (idx, type) {
    	
		this.toast('此项缴费暂未开通！');
    }

     /**
	 * 页面渲染
	 */
	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (

			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}

				<View style = {[styles.homeContainer]}>
					{this._renderHome()}
				   	<TouchableOpacity style={[styles.homeAddBtn]} onPress = {() => {this.onPressHomeAdd()}} >
				   		<Text style = {{fontSize: 17, color: '#5bc8f3'}} >编辑</Text>
		    		</TouchableOpacity>
				</View>

				{this._renderAddress()}

				<View style = {{paddingLeft: 15, marginBottom: 10, marginTop: 10}} >
					<Text>缴费账户</Text>
				</View>

				<ScrollView automaticallyAdjustContentInsets = {false} style = {[{flex: 1}]}  >
					{this._renderAccount()}
					<View style = {Global._styles.PLACEHOLDER20} />
				</ScrollView>
			</View>
		);
	}

	/**
	 * 渲染所有Home项
	 */
	_renderHome () {
		return this.state.homes.map(
			({name, city, address, accounts, key}, idx) => {
				let homeText = (idx == this.state.idx) ? styles.actHomeText : styles.homeText;
				let homeBtnBorderColor = (idx == this.state.idx) ? Global._colors.ORANGE : 'white';
				return (
					<TouchableOpacity key={name} style={[Global._styles.CENTER, styles.homeItem, {
						borderBottomWidth: 2, borderBottomColor: homeBtnBorderColor,
					}]} onPress = {() => {this.onPressHomeItem(idx)}} >
			    		<Text style = {[homeText]}>{name}</Text>
			    	</TouchableOpacity>
				);
			}
		);
	}

	/**
	 * 渲染家庭地址
	 */
	_renderAddress () {
		let idx = this.state.idx;
		return (
			<View style = {[styles.addressContainer]}>
				<View style={[Global._styles.CENTER, {flexDirection: 'row'}]}>
					<EasyIcon name = 'ios-pin' size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
					<Text style = {[styles.cityText]}>{this.state.homes[idx].city}</Text>
				</View>
				<Text style = {[styles.addressText]}>{this.state.homes[idx].address}</Text>
			</View>
		);
	}

	/**
	 * 渲染账号
	 */
	_renderAccount () {
		return feeTyes.map(
			({name, type, icon, iconLib, size, color, key}, idx) => {
				let _idx = this.state.idx;
				let _accounts = this.state.homes[_idx].accounts;
				let _code = "";
				let _codeContainer = null;
				_accounts.forEach((account) => {
					if(type == account.type ) {
						_code =  account.code;
					}
				});
				if(_code){
					_codeContainer = <Text style = {{fontSize: 12, marginTop: 5, color: Global._colors.FONT_LIGHT_GRAY}}> {_code} </Text>;
				}
				let topLine = idx === 0 ? <View style = {Global._styles.FULL_SEP_LINE} /> : <View style = {Global._styles.SEP_LINE} />;
				let bottomLine = idx === 5 ? <View style = {Global._styles.FULL_SEP_LINE} /> : null;

				if(this.state.isFolded){
					if(idx < 3){
						return (
							<View key = {type} style={[styles.sv, {backgroundColor: '#ffffff'}]}>
								{topLine}
								<TouchableOpacity style = {[styles.accountItem]} onPress={() => this.onPressAccount(idx, type)} >
									<EasyIcon iconLib = {iconLib} name = {icon} size = {size} width = {40} height = {40} radius = {20} color = 'white' backgroundColor = {color} />
									<View style = {{flex: 1, paddingLeft: 15, }}>
										<Text>{name}</Text>
										{_codeContainer}
									</View>
									<View style = {{flex: 1, alignItems: 'flex-end', paddingLeft: 20}} >
										<EasyIcon iconLib = 'ii' name = 'ios-arrow-forward-outline' size = {25} width = {30} height = {30} color = {Global._colors.IOS_ARROW} />
									</View>
						    	</TouchableOpacity>
						    	{bottomLine}
					    	</View>
						);
					} else if(idx == 3){
						return (
							<View key="unFolded" style={[styles.sv, {backgroundColor: '#ffffff'}]}>
								<View style={Global._styles.FULL_SEP_LINE} />
								<View style = {{backgroundColor: Global._colors.VIEW_BG, height: 20}} />
								<View style={Global._styles.FULL_SEP_LINE} />
								<TouchableOpacity style={[Global._styles.CENTER, {padding: 20,}]} onPress = {() => {this.onPressUnFolded()}} >
						    		<Text style = {[styles.unFolded]}>更多缴费</Text>
						    	</TouchableOpacity>
						    	<View style={Global._styles.FULL_SEP_LINE} />
					    	</View>
						);
					} else {
						return;
					}
				} else {
					return (
						<View key = {type} style={[styles.sv, {backgroundColor: '#ffffff'}]}>
							{topLine}
							<TouchableOpacity style = {[styles.accountItem]} onPress={() => this.onPressAccount(idx, type)} >
								<EasyIcon iconLib = {iconLib} name = {icon} size = {size} width = {40} height = {40} radius = {20} color = 'white' backgroundColor = {color} />
								<View style = {{flex: 1, paddingLeft: 15, }}>
									<Text>{name}</Text>
									{_codeContainer}
								</View>
								<View style = {{flex: 1, alignItems: 'flex-end', paddingLeft: 20}} >
									<EasyIcon iconLib = 'ii' name = 'ios-arrow-forward-outline' size = {25} width = {30} height = {30} color = {Global._colors.IOS_ARROW} />
								</View>
					    	</TouchableOpacity>
					    	{bottomLine}
				    	</View>
					);
				}
				
			}	
		);	
	}


	/**
	 * 渲染临时占位场景
	 */
	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this._getNavBar()}
			</View>
		);
	}

	/**
	 * 渲染导航栏
	 */
	_getNavBar () {
		return (
			<NavBar 
				title = '生活缴费'
				navigator = {this.props.navigator} 
				route = {this.props.route} 
				hideBottomLine = {false} 
			/>
		);
	}
}

const styles = StyleSheet.create({
	sv: {
	},
	homeContainer: {
 		flexDirection: 'row',
 		//height: 44, 
 		backgroundColor: 'white',
	    alignItems: 'center',
	    padding: 15,
	    paddingBottom: 5,
        paddingLeft: 0,
	},
	homeItem: {
		flex: 1,
		marginLeft: 20,
		paddingBottom: 15,
	},
	actHomeText: {
		fontSize: 17,
		color: Global._colors.ORANGE,
	},
	homeText: {
		fontSize: 17,
		color: Global._colors.FONT_GRAY,
	},
	homeAddBtn: {
		width: 80, 
		alignItems: 'flex-end', 
		paddingBottom: 17
	},
	addressContainer: {
 		height: 80, 
 		padding: 15, 
 		paddingTop: 0,
 		borderBottomWidth: 1 / Global._pixelRatio, 
 		borderBottomColor: Global._colors.IOS_SEP_LINE, 
 		backgroundColor: 'white',
	    justifyContent: 'center',
	},
	cityText: {
		flex: 1,
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
	},
	addressText: {
		fontSize: 12,
		color: Global._colors.FONT_LIGHT_GRAY,
		marginTop: 10,
		marginLeft: 17,
	},
	accountItem: {
		padding: 15,
		paddingLeft: 20,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	unFolded: {
		fontSize: 14,
		color: '#5bc8f3',
	},
});

export default Home;

