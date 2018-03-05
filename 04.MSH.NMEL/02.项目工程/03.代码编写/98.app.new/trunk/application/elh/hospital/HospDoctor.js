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
	Animated,
} from 'react-native';

import * as Global  		from '../../Global';

import NavBar       		from 'rn-easy-navbar';
import Card       			from 'rn-easy-card';
// import EasyIcon     		from 'rn-easy-icon';
import Separator   		 	from 'rn-easy-separator';
import Portrait     		from 'rn-easy-portrait';
import {B, I, U, S} 		from 'rn-easy-text';

import RegisterResource  	from '../register/RegisterResource';
	
const sbh = Global._os == 'ios' ? 20 : 0;
const picBgHeight =  Global.getScreen().width * (1 - 0.618);

const FIND_DESC_URL 	= 'el/base/desc/all';
const IMAGES_URL 		= 'el/base/images/view/';

class HospDoctor extends Component {

    static displayName = 'HospDoctor';
    static description = '医生';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		scrollY: new Animated.Value(0),
		descs: [],
		_refreshing: true,//控制刷新
	};

    constructor (props) {
        super(props);

        this.fetchDescData 			= this.fetchDescData.bind(this);

        this.renderBackground 		= this.renderBackground.bind(this);
        this.renderCalendar 		= this.renderCalendar.bind(this);
        this.renderDescs 			= this.renderDescs.bind(this);
        this._renderPlaceholderView = this._renderPlaceholderView.bind(this);
        this._getNavBar 			= this._getNavBar.bind(this);
        this._getBackBtn 			= this._getBackBtn.bind(this);

        this.onPressRegister 		= this.onPressRegister.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => this.fetchDescData());
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchDescData () {
		this.setState({
			_refreshing: true,
		});

		try {
			let data = encodeURI(JSON.stringify({
	            	fkId: this.props.doc.id,
	            	fkType: "doctor",
	        }));
			let responseData = await this.request(Global._host + FIND_DESC_URL + '?data=' + data, {
				method : "GET"
			});

			this.setState({
				descs: responseData.result,
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

    /**
	 * 导向到预约挂号
	 */
	onPressRegister (doc) {
		this.props.navigator.push({
        	title: '挂号',
            component: RegisterResource,
            hideNavBar: true,
			passProps: {
				hospitalId: doc.hospitalId,
				departmentId: doc.departmentId,
			}
        });
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let emptyView = !this.state._refreshing && !this.state._requestErr && (!this.state.descs || this.state.descs.length == 0) ? (
			<Card fullWidth = {true} style = {{paddingBottom: 20}} >
				<Text style = {[Global._styles.MSG_TEXT, {marginTop: 30, marginBottom: 20}]} >暂无医生详细介绍信息</Text>
			</Card>
		) : null;

		let portraitSource = this.props.doc.portrait ? 
			{uri: Global._host + IMAGES_URL + this.props.doc.portrait,} :
			require('../../res/images/hosp/doctors/default.png');

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
                    scrollEventThrottle={16}>
					
					<View style = {{alignItems: 'center', height: picBgHeight, paddingTop: sbh + 25}} >
						<Portrait imageSource = {portraitSource} 
							width = {50} height = {50} radius = {25} bgColor = 'rgba(102,51,0,.5)' 
							style = {styles.portrait}
						/>
						<Text style = {styles.docName} ><B><S>{this.props.doc.name}</S></B></Text>
					</View>

					<Separator height = {10} />

					<Card noPadding = {true} >
						{this.renderCalendar()}
					</Card>
					<Separator height = {10} />
					<Card >
						<View style = {Global._styles.CARD_TITLE} >
							<Text style = {Global._styles.CARD_TITLE_TEXT} >特长</Text>
						</View>
						<Text style = {[Global._styles.GRAY_FONT, {marginTop: 15}]} >{this.props.doc.speciality}</Text>
						{/*<Button stretch = {false} theme = {Button.THEME.ORANGE} onPress = {() => this.onPressRegister(this.props.doc)} style = {{width: 70, height: 25, position: 'absolute', top: 0, right: 15, borderRadius: 0}} >
							<Text style = {{fontSize: 12, color: 'white'}} >去挂号</Text>
						</Button>*/}
					</Card>
					<Separator height = {10} />

					{this.getLoadingView('正在载入医生详细介绍信息...', this.fetchDescData, {marginTop: 20})}
					{emptyView}
					{this.renderDescs()}

					<Separator height = {40} />

				</ScrollView>

				{this._getNavBar()}
			    {this._getBackBtn()}

			    {/*portrait*/}

			</View>
		);
	}

	renderBackground () {
        var { scrollY } = this.state;
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
                source={require('../../res/images/hosp/bg/default.png')} 
                resizeMode='cover' >
            </Animated.Image>
        );
    }

    renderCalendar () {
    	let days = ["","一","二","三","四","五","六","日"];

    	let width = (Global.getScreen().width - 36) / 8;

    	let dayViewStyle = {
    		width: width, 
    		height: width, 
    		marginLeft: 4, 
    		marginTop: 4,
    		alignItems: 'center',
    		justifyContent: 'center',
    		backgroundColor: Global._colors.IOS_GRAY_BG,
    	};
    	let dayTextStyle = {
    		fontSize: 10, 
    		color: Global._colors.FONT_GRAY,
    		textAlign: 'center',
    	};

    	let daysView = days.map((day, idx) => {
    		let dayText = idx == 0 ? ("常规出" + "\n" + "诊时间") : day;
    		return (
    			<View key = {'days_' + idx} style = {dayViewStyle} >
    				<Text style = {dayTextStyle} >{dayText}</Text>
    			</View>
    		);
    	});

    	let scheduleViewStyle = {
    		backgroundColor: 'rgba(253,253,253,1)'
    	};

    	// "clinic": "1;am;200|2;am;200|3;am;200"
    	let op = {};
    	if(this.props.doc.clinic) {
    		let scheArr = this.props.doc.clinic.split('|');
    		scheArr.forEach((sche) => {
    			let arr = sche.split(';');
    			op[arr[0] + arr[1]] = arr[2];
    		});
    	}

    	let amView = days.map((day, idx) => {
    		let fee = op[idx + 'am'];
    		let dayText = idx == 0 ? ("上午" + "\n" + "AM") : (fee ? fee : "");
    		let appendStyle = idx == 0 ? {} : (fee ? {backgroundColor: Global._colors.ORANGE} : scheduleViewStyle);
    		let whiteTextStyle = fee ? {color: 'white', fontSize: 14} : {};
    		return (
    			<View key = {'days_' + idx} style = {[dayViewStyle, appendStyle]} >
    				<Text style = {[dayTextStyle, whiteTextStyle]} >{dayText}</Text>
    			</View>
    		);
    	});

    	let pmView = days.map((day, idx) => {
    		let fee = op[idx + 'pm'];
    		let dayText = idx == 0 ? ("下午" + "\n" + "PM") : (fee ? fee : "");
    		let appendStyle = idx == 0 ? {} : (fee ? {backgroundColor: Global._colors.ORANGE} : scheduleViewStyle);
    		let whiteTextStyle = fee ? {color: 'white', fontSize: 14} : {};
    		return (
    			<View key = {'days_' + idx} style = {[dayViewStyle, appendStyle]} >
    				<Text style = {[dayTextStyle,whiteTextStyle]} >{dayText}</Text>
    			</View>
    		);
    	});

    	let rowStyle = {
    		flexDirection: 'row',
    	};

    	return (
    		<View>
	    		<View style = {rowStyle} >{daysView}</View>
	    		<View style = {rowStyle} >{amView}</View>
	    		<View style = {rowStyle} >{pmView}</View>
	    		<Separator height = {4} />
    		</View>
    	);
    }

    renderDescs() {
		if(!this.state.descs || this.state.descs.length==0){
			return null;
		}
		return(
			<Card >
				{this.state.descs.map((item, idx) => {
					return (
						<View key = {"desc_" + idx} style = {{marginTop: 12}} >
							<Text style = {[Global._styles.GRAY_FONT]} ><B>{item.caption}</B></Text>
							<Text style = {[Global._styles.GRAY_FONT, {marginTop: 10}]} >{item.body}</Text>
						</View>
					);
				})}
			</Card>
		);
	}


	_renderPlaceholderView () {
		return (
			<View style = {Global._styles.CONTAINER}>
			    {this.renderBackground()}
			    {this._getBackBtn()}
			</View>
		);
	}

	_getNavBar () {

		return (
			<Animated.View 
				style = {[styles.navbarHolder, {
			    	opacity: this.state.scrollY.interpolate({
		                inputRange: [-(picBgHeight), 0, (picBgHeight - Global._navBarHeight)],
		                outputRange: [0, 0, 1]
		            })
			    }]} >
			    <NavBar title = {this.props.doc.name} 
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
		                inputRange: [-(picBgHeight), 0, (picBgHeight - Global._navBarHeight)],
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

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
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
	},
	docName: {
		marginTop: 8,
		fontSize: 17,
		color: 'white',
		backgroundColor: 'transparent',
	},
});

export default HospDoctor;



