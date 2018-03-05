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
} from 'react-native';

import Swiper           from 'react-native-swiper';
import FAIcon      		from 'react-native-vector-icons/FontAwesome';

import * as Global 	    from 'elapp/Global';
import NavBar 			from 'rn-easy-navbar';
import Button			from 'rn-easy-button';
import Separator		from 'rn-easy-separator';
import {B, I, U, S}		from 'rn-easy-text';

import NewsDetail       from 'elapp/el/common/news/NewsDetail';
import HospMicroWebSite from 'elapp/elh/hospital/HospMicroWebSite';
import HospDepts 		from 'elapp/elh/hospital/HospDepts';
import HospDoctors 		from 'elapp/elh/hospital/HospDoctors';
import RegisterResource from 'elapp/elh/register/RegisterResource';
import Register 		from 'elapp/elh/register/Register';
import TreatmentHis 	from 'elapp/elh/treatment-his/TreatmentHis';
import CheckReportList 	from 'elapp/elh/check/CheckReportList';
import SIServices 		from 'elapp/elh/si/SIServices';
import News 			from 'elapp/elh/news/News';

const IMAGES_URL 	= 'el/base/images/view/';

const icons = {
	'hosp':			require('./res/images/base/hosp.png'),
	'reg': 			require('./res/images/base/reg.png'),
	'regRealtime': 	require('./res/images/base/reg-realtime.png'),
	'treat':		require('./res/images/base/treat.png'),
	'report':		require('./res/images/base/report.png'),
	'med':			require('./res/images/base/med.png'),
	'si':			require('./res/images/base/si.png'),
	'consult':		require('./res/images/base/consult.png'),
	'news':			require('./res/images/base/news.png'),
};

const bgColors = ['#ff6666','#ffcf2f','#8b8ffa','#4dc7ee','#2bd3c2','#ff80c3',];

let itemWidth = (Global.getScreen().width - 4) / 3;
let itemHeight = (Global.getScreen().height - Global.getScreen().width * (1 - 0.618) - Global._navBarHeight - 80) / 3;

class Home extends Component{

	static displayName = 'HospHome';
    static description = '首页';

    getServices () {
    	return [
			{code: '001', name: '医院介绍',	icon: 'hosp',		component: HospMicroWebSite,	navTitle: '医院微站'},
			{code: '002', name: '预约挂号',	icon: 'reg',		component: RegisterResource,	navTitle: '预约挂号'},
			{code: '003', name: '实时挂号',	icon: 'regRealtime',component: Register,			navTitle: '实时挂号'},
			{code: '004', name: '就诊记录',	icon: 'treat',		component: TreatmentHis,		navTitle: '就诊记录'},
			{code: '005', name: '报告单',	icon: 'report',		component: CheckReportList, 	navTitle: '报告单'},
			{code: '006', name: '用药提醒',	icon: 'med',		component: null, 				navTitle: '用药提醒'},
			{code: '007', name: '医疗保险',	icon: 'si',			component: SIServices,			navTitle: '医疗保险'},
			{code: '008', name: '在线咨询',	icon: 'consult',	component: null, 				navTitle: '在线咨询'},
			{code: '009', name: '公共资讯',	icon: 'news',		component: News, 				navTitle: '公共资讯'},
		];
    }
    
    getServicesProps () {
    	return {
			'001': {hosp: this.state.hosp},
			'002': {hosp: this.state.hosp},
			'003': {hospitalId: this.state.hosp.id},
			'004': {hosp: this.state.hosp},
			'005': {hosp: this.state.hosp},
			'006': {hosp: this.state.hosp},
			'007': null,
			'008': null,
			'009': null,
    	};
    }

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
	    loaded: false,
	    data: null,
	    //specialImage: {},
	    hosp: null,
	};
	
	constructor (props) {
        super(props);

        this.getServices 			= this.getServices.bind(this);
        this.fetchAD 				= this.fetchAD.bind(this);
        this.fetchHosp 				= this.fetchHosp.bind(this);
        this.onPressDetail 			= this.onPressDetail.bind(this);
        this.onPressMenuItem 		= this.onPressMenuItem.bind(this);
    }
	
	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchHosp();
		 		this.fetchAD();
			});
	    });
	}
	
	/**
	 * 加载广告轮播
	 */
	async fetchAD() {
		let FIND_URL = 'el/ad/app/list/80281882554de9e101554df07eed0004';
		try {
			let responseData = await this.request(Global._host + FIND_URL, {
				method:'GET', null
			});

			this.setState({
        		data: responseData.result,
        		loaded: true,
        	});

        } catch(e) {
            this.handleRequestException(e);
        }
	}

	/**
	 * 加载医院数据
	 */
	async fetchHosp () {
		let FETCH_URL  = 'elh/hospital/';
		try {
			this.showLoading();
			let responseData = await this.request(Global._host + FETCH_URL + Global.Config['_HOSP_ID'], {
				method: 'GET',
			});
			//console.log(responseData);
			
			this.setState({
				hosp: responseData.result
			});
			Global._hosp = responseData.result;

		} catch (e) {
			this.handleRequestException(e);
		}
	}
	
	onPressMenuItem (idx) {
		let services = this.getServices();
    	if(services[idx]['component'])
	        this.props.navigator.push({
	        	title: services[idx]['navTitle'],
	            component: services[idx]['component'],
	            hideNavBar: true,
	            passProps: this.getServicesProps()[services[idx]['code']],
	        });
	    else
	    	this.toast(services[idx]['navTitle'] + '即将开通');
    }

	_renderMenu () {
		let iconWidth = itemHeight * .5;
		return this.getServices().map(
			({code, name, icon, component, navTitle, passProps}, idx) => {
				let bgColor = idx >= 6 ? bgColors[idx % 6] : bgColors[idx];
				return (
					<TouchableOpacity key = {code} style = {[styles.menuItem]} onPress = {() => {this.onPressMenuItem(idx)}} >
						<View style = {{
							width: iconWidth,
							height: iconWidth,
							borderRadius: iconWidth / 2,
							backgroundColor: bgColor,
							alignItems: 'center',
							justifyContent: 'center',
						}} >
				    		<Image 
				    			resizeMode = 'cover'
				    			source = {icons[icon]}
				    			style = {{
				    				width: iconWidth / 2,
				    				height: iconWidth / 2,
				    				backgroundColor: 'transparent',
				    			}}
				    		/>
			    		</View>
			    		<Text style = {[styles.text]}>{name}</Text>
			    	</TouchableOpacity>
				);
			}
		);
	}

    render () {
    	if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		/*let featureBackground = !this.state.specialImage.featureBackground ? "defaultUri" : this.state.specialImage.featureBackground;
		let expertBackground = !this.state.specialImage.featureBackground ? "defaultUri" : this.state.specialImage.expertBackground;*/
		return(
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >

					<View style={styles.swiperContainer}>
						{this._renderSwiper()}
					</View>

		 		    {/*<View style={styles.specialBtnContainer}>
		 		   		<TouchableOpacity style={styles.specialBtn} onPress={() => {
		 		   			this.props.navigator.push({
		 		   				title: '特色专家',
		 		   				component: HospDoctors,
		 		   				hideNavBar: false,
		 		   				passProps: {
		 		   					hosp: this.state.hosp,
		 		   					isExpert: true,
		 		   				}
		 		   			});
		 		   		}} >
							<Text style = {styles.specialBtnText}>特色专家</Text>
						</TouchableOpacity>
						<Separator width = {1 / Global._pixelRatio} style = {{backgroundColor: Global._colors.IOS_SEP_LINE}} />
						<TouchableOpacity style={styles.specialBtn} onPress={() => {
		 		   			this.props.navigator.push({
		 		   				title: '特色科室',
		 		   				component: HospDepts,
		 		   				hideNavBar: false,
		 		   				passProps: {
		 		   					hosp: this.state.hosp,
		 		   					isSpecial: true,
		 		   				}
		 		   			});
		 		   		}} >
							<Text style = {styles.specialBtnText}>特色科室</Text>
						</TouchableOpacity>
					</View>*/}

					<View style={styles.menu} >
			    		{this._renderMenu()}
			    	</View>

	    		</ScrollView>
    		</View>
    	)
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
			<NavBar title = '内蒙古第一医院' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {true} 
		    	hideBottomLine = {false} />
		);
	}
	
	_renderSwiper () {
		if(!this.state.data){
	    	return (
	    		<View style={styles.wrapper} >
	    			<Text style = {{textAlign :'center', marginTop: Global.getScreen().width * (1 - 0.618) / 2 - 10}}>载入中...</Text>
	    		</View>
	    	);
	    }

	    return(
    		<Swiper style = {styles.wrapper} height = {Global.getScreen().width * (1 - 0.618)} showsButtons = {false} autoplay = {true} loop = {true} paginationStyle = {{bottom: 2}} >
				{this._renderPage()}
	 	    </Swiper>
    	)
	}

	_renderPage () {
	    return this.state.data.map(
			({image, article},idx ) => {
				return(
		    		<View key = {idx} style={styles.ad}>
			          	<TouchableOpacity style = {styles.ad} onPress={() => {this.onPressDetail(article);}} >
			              	<Image style={styles.adImage} resizeMode = "cover" source={{uri: Global._host + IMAGES_URL + image,}} />
		              	</TouchableOpacity>
		          	</View>
				);
			});
	}

	onPressDetail(article) {
        if(article){
        	this.props.navigator.push({
        		component: NewsDetail, 
        		hideNavBar: true, 
        		passProps: {
        			newsItem: {id:article},
        		},
        	});
       	}
	}
}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},

	swiperContainer: {
		width: Global.getScreen().width,
		height: Global.getScreen().width * (1 - 0.618),
		backgroundColor: 'white',
		borderBottomWidth: 1 / Global._pixelRatio,
		borderBottomColor: Global._colors.IOS_SEP_LINE,
	},
	ad: {
		width: Global.getScreen().width,
		height: Global.getScreen().width * (1 - 0.618),
		justifyContent: 'center',
		backgroundColor: 'transparent',
		flexDirection: 'row',
	},
	adImage: {
		flex: 1,
	},

	specialBtnContainer: {
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		height: 40,
	},
	specialBtn: {
		flex: 1,
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	specialBtnImgBg: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	specialBtnText: {
		//flex: 1,
		color: Global._colors.FONT_GRAY,
		//textAlign :'right',
		fontSize: 15,
		//marginRight:10,
		backgroundColor: 'transparent'
	},

	menu: {
		marginTop: 0,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
        backgroundColor: 'transparent',
	},
	menuItem: {
		width: itemWidth,
		height: itemHeight,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 1,
		overflow: 'hidden',
	},
	text: {
		width: itemWidth - 10,
		fontSize: 15,
		textAlign: 'center',
		overflow: 'hidden',
		marginTop: 10,
	},
})

export default Home;



