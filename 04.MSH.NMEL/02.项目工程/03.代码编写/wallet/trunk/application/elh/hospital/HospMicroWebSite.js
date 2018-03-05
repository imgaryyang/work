'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
	InteractionManager,
	Animated,
	RefreshControl,
} from 'react-native';

import * as Global  from '../../Global';
import * as Filters from '../../utils/Filters';

import NavBar       from 'rn-easy-navbar';
import Card       	from 'rn-easy-card';
import Button       from 'rn-easy-button';
import EasyIcon     from 'rn-easy-icon';
import Separator    from 'rn-easy-separator';
import Portrait     from 'rn-easy-portrait';
import {B, I, U, S} from 'rn-easy-text';

import HospHome 	from './HospHome';
import HospDepts 	from './HospDepts';
import HospDoctors 	from './HospDoctors';
import NewsList 	from '../../el/common/news/NewsList';
	
const sbh = Global._os == 'ios' ? 20 : 0;

const IMAGES_URL = 'el/base/images/view/';
const FETCH_URL  = 'elh/hospital/';

class HospMicroWebSite extends Component {

    static displayName = 'HospMicroWebSite';
    static description = '医院微站';

	getHospId () {
		return this.props.id ? this.props.id : this.props.hosp.id;
	}

    menus = [
		{text: '首页', component: HospHome, passProps: {navigator: this.props.navigator}},
		{text: '科室', component: HospDepts, passProps: {navigator: this.props.navigator}},
		{text: '医生', component: HospDoctors, passProps: {navigator: this.props.navigator}},
		{text: '院报', component: NewsList, passProps: {data: {fkId: this.getHospId(), fkType: 'H1'}, typeText: '院报', loadingText: '正在载入院报信息...', navigator: this.props.navigator}},
		{text: '特色', component: NewsList, passProps: {data: {fkId: this.getHospId(), fkType: 'H2'}, typeText: '医院特色', loadingText: '正在载入医院特色信息...', navigator: this.props.navigator}},
	];

    static propTypes = {
    	/**
    	 * 医院基础信息对象
    	 */
    	hosp: PropTypes.object,

    	/**
    	 * 医院id
    	 * 如果不传入hosp对象，可以直接传入id查询医院信息
    	 */
    	id: PropTypes.string,
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		scrollY: new Animated.Value(0),
		menuIdx: 0,
		hosp: this.props.id ? {id: this.props.id} : this.props.hosp,
		id: this.props.id,
		_refreshing: false,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
		//selectedView: null,
		//viewsPosition: {},
	};

    constructor (props) {
        super(props);
        
        this.fetchData 				= this.fetchData.bind(this);
        this.refresh 				= this.refresh.bind(this);
        this.pullToRefresh 			= this.pullToRefresh.bind(this);
        this.onChildCompLoaded 		= this.onChildCompLoaded.bind(this);
        this.getHospId 				= this.getHospId.bind(this);
        this.getPicBgHeight 		= this.getPicBgHeight.bind(this);
        this.renderBackground 		= this.renderBackground.bind(this);
        this._renderPlaceholderView = this._renderPlaceholderView.bind(this);
        this._getNavBar 			= this._getNavBar.bind(this);
        this._getBackBtn 			= this._getBackBtn.bind(this);
        this._getNavMenu 			= this._getNavMenu.bind(this);
        this._onMenuPress 			= this._onMenuPress.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			//如果未传入hosp而是传入的医院id，则通过id查询医院信息
			if(this.props.id) {
				this.setState({
					doRenderScene: true,
					_refreshing: true,
				}, () => {
					this.refresh();
				});
			} else {
				this.setState({
					doRenderScene: true
				});
			}
		});
	}

	/**
	 * 子组件加载完成后回调
	 */
	onChildCompLoaded () {
		this.setState({
			_pullToRefreshing: false
		});
	}

	/**
	 * 刷新数据
	 */
	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	/**
	 * 下拉刷新
	 */
	pullToRefresh () {
		if(!this.props.id && this.state.menuIdx == 0)
			return;

		this.setState({
			_pullToRefreshing: true,
		}, () => {
			//如果处在首页，则只刷新本页中医院基本信息
			if(this.state.menuIdx == 0) {
				this.fetchData();
			} else { //调用对应组件的刷新
				this.currComp.pullToRefresh();
			}
		});
	}

	/**
	 * 加载数据
	 */
	async fetchData () {
		try {
			let responseData = await this.request(Global._host + FETCH_URL + this.state.id, {
				method: 'GET',
			});
			//console.log(responseData);
			this.setState({
				hosp: responseData.result
			});
		} catch (e) {
			this.handleRequestException(e);
		}
	}

    getPicBgHeight() {
    	return Global.getScreen().width * (1 - 0.618);
    }

    renderBackground () {
        var picBgHeight = this.getPicBgHeight();
        var { scrollY } = this.state;
        var bgSource = this.state.hosp.elhOrg ? 
        	{uri: Global._host + IMAGES_URL + this.state.hosp.elhOrg.hosHomeBg} : 
        	require('../../res/images/hosp/bg/default.jpg');
        return (
            <Animated.Image
                style={[styles.bg, {
                    height: picBgHeight,
                    transform: [{
                        translateY: scrollY.interpolate({
                            inputRange: [ -picBgHeight, 0, picBgHeight],
                            outputRange: [picBgHeight/2, 0, -picBgHeight]
                        })
                    }, {
                        scale: scrollY.interpolate({
                            inputRange: [ -picBgHeight, 0, picBgHeight],
                            outputRange: [2, 1, 1]
                        })
                    }]
                }]}
                source={bgSource} 
                resizeMode='cover' >
            </Animated.Image>
        );
    }

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

 		let flowNavMenu = (
 			<Animated.View style = {[styles.navMenuHolder, {
	 				opacity: this.state.scrollY.interpolate({
		                inputRange: [(this.getPicBgHeight() - Global._navBarHeight), (this.getPicBgHeight() - Global._navBarHeight) + 1],
		                outputRange: [0, 1]
		            }),
	 			}]} >
 				{this._getNavMenu()}
 			</Animated.View>
 		);

 		let selectedView = null;
 		if(!this.state._refreshing && !this.state._refreshing && !this.state._requestErr && this.menus[this.state.menuIdx]['component']) {
 			let Comp = this.menus[this.state.menuIdx]['component'];
 			let passProps = this.menus[this.state.menuIdx]['passProps'];
	 		selectedView = <Comp ref = {(c) => this.currComp = c} onChildCompLoaded = {this.onChildCompLoaded} hosp = {this.state.hosp} {...passProps} />
 		}

 		let logoSource = this.state.hosp.elhOrg ? 
 			{uri: Global._host + IMAGES_URL + this.state.hosp.elhOrg.logo} : 
 			require('../../res/images/hosp/default.png');

 		let levelText = this.state.hosp.elhOrg ? 
 			Filters.filterHospLevel(this.state.hosp.elhOrg.hosLevel) + " | " + Filters.filterHospType(this.state.hosp.elhOrg.hosType) : 
 			null;

		return (
			<View style = {Global._styles.CONTAINER} >

				{this.renderBackground()}

				<ScrollView 
					ref={component => { this._scrollView = component; }} 
					style = {styles.scrollView} 
					automaticallyAdjustContentInsets = {false} 
					onScroll={Animated.event(
                    	[{ nativeEvent: { contentOffset: { y: this.state.scrollY }}}]
                    )}
                    scrollEventThrottle={16}
			        refreshControl = {
						<RefreshControl
							refreshing = {this.state._pullToRefreshing}
							onRefresh = {this.pullToRefresh}
						/>
					} >
					
					<View style = {{alignItems: 'center', height: this.getPicBgHeight(), paddingTop: sbh}} >
						<Portrait imageSource = {logoSource} 
							width = {50} height = {50} radius = {25} bgColor = 'rgba(102,51,0,.5)' 
							style = {styles.portrait}
						/>
						<Text style = {styles.hospName} ><B><S>{this.state.hosp.name}</S></B></Text>
						<Text style = {styles.levelText} ><S>{levelText}</S></Text>
					</View>

					{this._getNavMenu()}

					<Separator height = {10} />

					{this.getLoadingView('正在查询医院信息...', this.refresh)}

					{selectedView}

				</ScrollView>

				{this._getNavBar()}
			    {this._getBackBtn()}
				{flowNavMenu}

			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER} >
				{this.renderBackground()}
				<View style = {{alignItems: 'center', height: this.getPicBgHeight(), backgroundColor: 'transparent'}} ></View>
				{this._getNavMenu()}

			    {this._getBackBtn()}
			</View>
		);
	}

	_getNavBar () {

		return (
			<Animated.View 
				style = {[styles.navbarHolder, {
			    	opacity: this.state.scrollY.interpolate({
		                inputRange: [-(this.getPicBgHeight()), 0, (this.getPicBgHeight() - Global._navBarHeight)],
		                outputRange: [0, 0, 1]
		            })
			    }]} >
			    <NavBar title = {this.state.hosp.name} 
			    	navigator = {this.props.navigator} 
					route = {this.props.route} 
			    	hideBackButton = {false} 
			    	hideBottomLine = {false} />
			</Animated.View>
		);
	}

	_getBackBtn () {
		let topPos = Global._os == 'ios' ? 20 : 0;
		let patchStyle = Global._os == 'ios' ? {marginTop: 2.2} : null;
		return (
			<Animated.View 
				style = {[styles.backBtnHolder, {
					top: topPos,
					opacity: this.state.scrollY.interpolate({
		                inputRange: [-(this.getPicBgHeight()), 0, (this.getPicBgHeight() - Global._navBarHeight)],
		                outputRange: [1, 1, 0]
		            })
				}]} >
				<TouchableOpacity style = {[styles.backBtn]} 
					onPress = {() => this.props.navigator.pop()} >
					<EasyIcon name = 'ios-arrow-back' size = {22} color = 'white' width = {23} style = {[{backgroundColor: 'transparent'}, patchStyle]} />
				</TouchableOpacity>
			</Animated.View>
		);
	}

	_onMenuPress (idx) {
		/*let preSelectedIdx = this.state.menuIdx, selectedView;
		if(this.views[idx]) {
			selectedView = this.views[idx];
		} else {
			selectedView = 
		}*/
		this.setState({
			menuIdx: idx,
			//selectedView: selectedView,
		});
	}

	_getNavMenu () {
		let items = this.menus.map((item, idx) => {
			let selectedViewStyle = this.state.menuIdx == idx ? {borderBottomColor: Global._colors.ORANGE} : null;
			let selectedTextStyle = this.state.menuIdx == idx ? {color: Global._colors.ORANGE} : null;
			return (
				<TouchableOpacity key = {'menu_item_' + idx} style = {[styles.navMenuItem, selectedViewStyle]} onPress = {() => this._onMenuPress(idx)} >
					<Text style = {[styles.navMenuItemText, selectedTextStyle]} >{item.text}</Text>
				</TouchableOpacity>
			);
		});
		return (
			<View style = {[styles.navMenu]} >
				{items}
			</View>
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		//marginBottom: Global._os == 'ios' ? 48 : 0,
	},
    bg: {
        position: 'absolute',
		width: Global.getScreen().width,
	},
	navbarHolder: {
		position: 'absolute',
		left: 0,
		top: 0,
	},

	backBtnHolder: {
		position: 'absolute',
		left: 0,
        width: 88,
        height: 44,
	},
	backBtn: {
        flex: 1, 
        flexDirection: 'row', 
        width: 88,
        height: 44,
        alignItems: 'center', 
        justifyContent: 'flex-start',
        backgroundColor: 'transparent',
        paddingLeft: 7,
    },

	portrait: {
		marginTop: 12,
	},
	hospName: {
		marginTop: 8,
		fontSize: 17,
		color: 'white',
		backgroundColor: 'transparent',
	},
	levelText: {
		fontSize: 14, 
		marginTop: 6, 
		color: 'white',
		backgroundColor: 'transparent',
	},

	tabview: {
		//marginTop: 15,
		backgroundColor: 'rgba(0, 0, 0, .3)',
	},

	navMenu: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		borderBottomWidth: 1 / Global._pixelRatio,
		borderBottomColor: Global._colors.IOS_SEP_LINE,
	},
	navMenuItem: {
		width: 70,
		height: 40,
		justifyContent: 'center',
		backgroundColor: 'white',
		borderBottomWidth: 2,
		borderBottomColor: 'white',
	},
	navMenuItemText: {
		fontSize: 14,
		color: Global._colors.FONT_GRAY,
		textAlign: 'center',
	},

	navMenuHolder: {
		position: 'absolute',
		top: Global._navBarHeight,
		left: 0,
		width: Global.getScreen().width,
		overflow: 'hidden',
	},
});

export default HospMicroWebSite;



