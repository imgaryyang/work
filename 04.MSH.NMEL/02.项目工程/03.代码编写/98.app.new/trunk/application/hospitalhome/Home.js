'use strict';

import React, {
    Component,

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

import * as Global 	    from '../Global';
import Swiper           from 'react-native-swiper';

import NavBar			from 'rn-easy-navbar';
// import EasyIcon     	from 'rn-easy-icon';

import NewsDetail       from '../el/common/news/NewsDetail';

const NEWS_URL 		= 'el/base/news/';
const IMAGES_URL 	= 'el/base/images/view/';
const FIND_URL 		= 'el/ad/app/hospital/list/80281882554de9e101554df07eed0004';
const SPECIAL_URL	= 'elh/app/special/8a8c7d9b55298217015529a9844e0000';

const services = [
	{code: '001', name: '医院介绍', 		icon: 'credit-card', 	iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '医院介绍',},
	{code: '002', name: '预约挂号', 		icon: 'fire', 			iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '预约挂号',},
	{code: '003', name: '实时挂号', 		icon: 'flag-checkered',	iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '实时挂号',},
	{code: '004', name: '报告单', 			icon: 'heartbeat',		iconSize: 28, iconColor: '#FF6600', component: null,	hideNavBar: true, navTitle: '报告单',},
	{code: '005', name: '就诊记录', 		icon: 'life-saver',		iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '就诊记录',},
	{code: '006', name: '医疗咨询', 		icon: 'flask',			iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '医疗咨询',},
	{code: '007', name: '公共资讯', 		icon: 'space-shuttle', 	iconSize: 28, iconColor: '#FF6600', component: null, 	hideNavBar: true, navTitle: '公共资讯',},
];

class Home extends Component{

	static displayName = 'Home';
    static description = '首页';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
	    loaded: false,
	    data: null,
	    specialImage: {},
	    services: services,
	};
	
	constructor (props) {
        super(props);

        this.fetchData 				= this.fetchData.bind(this);
       
        this.onPressDetail 			= this.onPressDetail.bind(this);
    }
	
	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		 	this.fetchData();
	    });
	}
	
	async fetchData() {
		try {
			let responseData = await this.request(Global._host + FIND_URL, {
				method:'GET'
			});

			this.setState({
        		data: responseData.result,
        		loaded: true,
        	});

        	let specialData = await this.request(Global._host + SPECIAL_URL,{
        		method:'GET'
        	});

        	this.setState({
        		specialImage: specialData.result,
        	});

        } catch(e) {
            this.handleRequestException(e);
        }
	}
	
	onPressMenuItem (component, hideNavBar, navTitle) {
    	if(component)
	        this.props.navigator.push({
	        	title: navTitle,
	            component: component,
	            hideNavBar: hideNavBar ? hideNavBar : false,
	        });
	    else
	    	this.toast(navTitle + '即将开通');
    }

    render () {
    	if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let featureBackground = !this.state.specialImage.featureBackground ? "defaultUri" : this.state.specialImage.featureBackground;
		let expertBackground = !this.state.specialImage.featureBackground ? "defaultUri" : this.state.specialImage.expertBackground;
		return(
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollView automaticallyAdjustContentInsets = {false} style = {styles.scrollView} >
					<View style={{width: itemWidth ,height: itemWidth/3,backgroundColor:'#EEEEEE'}}>
						{this._renderSwiper()}
					</View>
		 		    <View style={{flexDirection: 'row'}}>
		 		    <View style={{marginTop: 10,marginBottom:10,backgroundColor:'#EEEEEE',borderColor:'#FFFFFF',borderRightWidth:1,flex:1,}} >
		 		   		<TouchableOpacity onPress={() => {this.toast('即将开通');}} >
							<Image style={styles.image1} resizeMode={Image.resizeMode.stretch} source={{uri: Global._host + IMAGES_URL + featureBackground,}} >
								<Text style = {{color: '#5D5D5D',textAlign :'right',fontSize: 15,marginTop:10,marginRight:10,}}>特色医生</Text>
							</Image>
						</TouchableOpacity>
					</View>
					<View style={{marginTop: 10,marginBottom:10,backgroundColor:'#EEEEEE',borderLeftWidth: 0,flex:1,}} >
						<TouchableOpacity onPress={() => {this.toast('即将开通');}} >
							<Image style={styles.image1} resizeMode={Image.resizeMode.stretch} source={{uri: Global._host + IMAGES_URL + expertBackground,}} >
								<Text style = {{color: '#5D5D5D',textAlign :'right',fontSize: 15,marginTop:10,marginRight:10,}}>特色科室</Text>
							</Image>
						</TouchableOpacity>
					</View>
					</View>
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
			<NavBar title = '内蒙古国际蒙医医院' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}
	
	_renderSwiper () {
		if(!this.state.data){
	    	return (
	    		<View>
	    			<Text style = {{textAlign :'center',marginTop: itemWidth/6}}>载入中...</Text>
	    		</View>
	    	);
	    }

	    return(
	    		<Swiper style={styles.wrapper} height={itemWidth/3} showsButtons={true} autoplay={true} loop = {true} >
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
			              	<Image style={styles.image} source={{uri: Global._host + IMAGES_URL + image,}} />
		              	</TouchableOpacity>
		          	</View>
				);
			});
	}

	_renderMenu () {
		return this.state.services.map(
			({code, name, icon, iconSize, iconColor, component, hideNavBar, navTitle, key}, idx) => {
				let noLeftBorder = ((idx + 1) % 2 == 0) ? styles.noLeftBorder : null;
				let topBorder = ((idx == 1)||(idx == 0)) ? styles.topBorder : null ;
				let iconDisplayColor = component ? iconColor : iconColor;
				
				return (
					<TouchableOpacity key = {code} style = {[{flexDirection: 'row',justifyContent:'center', alignItems:'flex-start'},styles.menuItem, noLeftBorder, topBorder]} onPress = {() => {this.onPressMenuItem(component, hideNavBar, navTitle)}} >
			    		<EasyIcon iconLib = 'fa' style = {[styles.icon]} name = {icon} size = {iconSize} color = {iconDisplayColor} />
			    		<Text style = {[styles.text]}>{name}</Text>
			    	</TouchableOpacity>
				);
			}
		);
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

let itemWidth = (Global.getScreen().width * Global._pixelRatio - 1)/Global._pixelRatio;

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
		backgroundColor: 'white',
		marginBottom: Global._os == 'ios' ? 48 : 0,
	},
	wrapper: {
	},
	ad: {
		width: itemWidth ,
		height: itemWidth/3 ,
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	image:{
		flex: 1,
	},
	image1:{
		flex: 1,
		width: itemWidth/2 ,
		height: itemWidth/10 ,
		borderRadius: 3,
	},
	icon: {
		flex:1,
		width: 30,
		height: 30,
	},
	menuItem: {
		width: itemWidth/2,
		height: itemWidth/5,
		justifyContent: 'center',
		alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
		borderWidth: 1 / Global._pixelRatio,
		borderColor: Global._colors.IOS_SEP_LINE,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	text: {
		flex:2,
		// width: itemWidth - 10,
		fontSize: 15,
		//textAlign: 'center',
		overflow: 'hidden',
	},
	noLeftBorder: {
		borderRightWidth: 0,
	},
	topBorder:{
		borderTopWidth: 1 / Global._pixelRatio,
	},
	menu: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden', 
        backgroundColor: 'transparent',
	},
})

export default Home;