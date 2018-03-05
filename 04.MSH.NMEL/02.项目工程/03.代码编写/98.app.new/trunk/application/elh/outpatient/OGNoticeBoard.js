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
	ListView,
	ActivityIndicator,
	RefreshControl,
	Animated,
} from 'react-native';

import Swiper       from 'react-native-swiper';

import * as Global  		from '../../Global';

import Card       			from 'rn-easy-card';
// import EasyIcon     		from 'rn-easy-icon';
import Separator    		from 'rn-easy-separator';
import Portrait     		from 'rn-easy-portrait';
import {B, I, U, S} 		from 'rn-easy-text';

import OutpatientGuidance 	from './OutpatientGuidance';

const FETCH_URL = 'elh/treat/my/treatment/unclose/list/';

class OGNoticeBoard extends Component {

    static displayName = 'OGNoticeBoard';
    static description = '门诊导诊列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		_refreshing: true,
		msg: '',
		data: [],
		doRenderScene: false,
		height: new Animated.Value(225),
	};

    constructor (props) {
        super(props);

        this.refresh 			= this.refresh.bind(this);
        this.fetchData 			= this.fetchData.bind(this);
        this._renderSwiper 		= this._renderSwiper.bind(this);
        this._renderSwiperItems = this._renderSwiperItems.bind(this);
        this.showGuidance 		= this.showGuidance.bind(this);
        this.shrink				= this.shrink.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => this.refresh());
		});
	}

	refresh () {
		this.setState({
			_refreshing: true,
		}, () => {
			this.fetchData();
		});
	}

	async fetchData () {
		try {

			let treatData = await this.request(Global._host + FETCH_URL, {
				method:'GET',
			});

			console.log(treatData);
			if(treatData.result && treatData.result.length > 0) {
				this.setState({
					data: treatData.result,
				});
			} else {
				this.shrink();
			}

		} catch(e) {
			this.handleRequestException(e);
		}
	}

	shrink () {
		Animated.timing(
	       	this.state.height,
	       	{
	       		toValue: 0,
	       		duration: 600,
	       		delay: 1700,
	       	},
	    ).start();
	}

	showGuidance (row) {
		this.props.navigator.push({
			component: OutpatientGuidance,
			hideNavBar: true,
			passProps: {
				row: row,
				item: {
					id: row.id,
					idHlht: row.idHlht,
					type: row.type,
					department: row.department,
					departmentId: row.departmentId,
					departmentName: row.departmentName,
					doctor: row.doctor,
					doctorId: row.doctorId,
					doctorName: row.doctorName,
					medcialResult: row.medcialResult,
					notification: row.notification,
					status: row.status,
					startTime: row.startTime,
					createTime: row.createTime,
					updateTime: row.updateTime,
				},
				refresh: this.refresh,
			}
		})
	}

	render () {

		let emptyView = !this.state._refreshing && !this.state._requestErr && this.state.data.length == 0 ? (
			<View style = {[Global._styles.MSG_VIEW, {marginTop: 80}]} >
				<Text style = {Global._styles.MSG_TEXT} >暂无未完成的就诊记录</Text>
			</View>
		) : null;

		return (
			<Animated.View style={[styles.swiperContainer, {height: this.state.height}]}>
				<View style = {styles.swiperReplaceHolder} />
				{this.getLoadingView('正在载入未完成的就诊记录...', this.refresh, {marginTop: 60})}
				{emptyView}
				{this._renderSwiper()}
			</Animated.View>
		);
	}

	_renderSwiper () { //height: 197
	    return(
    		<Swiper style = {styles.wrapper} height = {225} showsButtons = {false} autoplay = {false} loop = {false} paginationStyle = {{bottom: 2}} >
				{this._renderSwiperItems()}
	 	    </Swiper>
    	)
	}

	_renderSwiperItems () {
		//console.log(this.state.data);
	    return this.state.data.map(
			(row, idx ) => {
				let portrait = row.patient.photo ? 
					{uri: (Global._host + 'el/base/images/view/' + row.patient.photo)} : 
					require('../../res/images/me-portrait-dft.png');
				return(
		    		<Card key = {row.id} fullWidth = {true} style = {styles.item} >
						<View style = {[styles.hospHolder, Global._styles.CENTER]} >
							<Portrait imageSource = {require('../../res/images/hosp/logo01.png')} width = {26} height = {26} />
							<Text style = {{marginLeft: 15, flex: 1}} >{row.hospitalName}</Text>
						</View>
						<Separator style = {Global._styles.FULL_SEP_LINE} />
						<View style = {[styles.patientHolder, Global._styles.CENTER]} >
							<Portrait imageSource = {portrait} bgColor = {Global._colors.IOS_GRAY_BG} width = {30} height = {30} radius = {5} />
							<Text style = {styles.patientName} >{row.patientName}</Text>
							<View style = {styles.cardHolder} >
								<Text style = {styles.cardTypeName} >{row.cardTypeName}</Text>
								<Text style = {styles.cardNo} >{row.cardNo}</Text>
							</View>
						</View>
						<Separator style = {Global._styles.FULL_SEP_LINE} />

						<TouchableOpacity key = {row.doctorId + idx} style = {[{flexDirection: 'row'}, Global._styles.CENTER]} onPress = {() => this.showGuidance(row)} >
							<Text style = {styles.deptName} >{row.departmentName}</Text>
							<View style = {styles.treatBrief} >
								<Text style = {styles.doc} ><B>主诊医生：</B>{row.doctorName}{row.doctorTitle ? " [ " + row.doctorTitle + " ]" : ""}</Text>
								<View style = {[styles.notificationHolder, Global._styles.CENTER]} >
									<EasyIcon name = "md-arrow-dropright-circle" size = {15} color = {Global._colors.IOS_BLUE} />
									<Text style = {styles.notification} >{row.notification}</Text>
								</View>
								<View style = {[styles.addrHolder, Global._styles.CENTER]} >
									<EasyIcon name = "ios-pin" size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
									<Text style = {styles.addr} >{row.department.address}</Text>
								</View>
							</View>
							<EasyIcon name = "ios-arrow-forward" color = {Global._colors.FONT_LIGHT_GRAY1} size = {20} width = {25} height = {25} />
						</TouchableOpacity>

					</Card>
				);
			});
	}

}

const styles = StyleSheet.create({

	swiperContainer: {
		width: Global.getScreen().width,
		backgroundColor: 'transparent',
		overflow: 'hidden',
	},
	swiper: {
	},
	swiperReplaceHolder: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: Global.getScreen().width,
		height: 197,
		backgroundColor: 'white',
		borderBottomColor: Global._colors.IOS_SEP_LINE, 
		borderBottomWidth: 1 / Global._pixelRatio
	},
	swiperItem: {
		width: Global.getScreen().width,
		justifyContent: 'center',
		backgroundColor: 'transparent',
		flexDirection: 'row',
	},

	list: {
		flex: 1,
		//top: - 1 / Global._pixelRatio,
	},
	sepInCard: {
		height: 1 / Global._pixelRatio, 
		backgroundColor: Global._colors.IOS_SEP_LINE, 
		left: -15,
		width: Global.getScreen().width,
	},

	item: {
		paddingLeft: 0, 
		paddingRight: 0, 
		paddingTop: 0, 
		paddingBottom: 0
	},
	hospHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	patientHolder: {
		flexDirection: 'row', 
		padding: 15
	},
	patientName: {
		flex: 1, 
		marginLeft: 15
	},
	cardHolder: {
		flex: 1, 
		alignItems: 'flex-end'
	},
	cardTypeName: {
		fontSize: 10, 
		color: Global._colors.FONT_LIGHT_GRAY
	},
	cardNo: {
		fontSize: 12, 
		color: Global._colors.FONT_GRAY, 
		marginTop: 4
	},

	deptName: {
		width: 60, 
		fontSize: 13, 
		fontWeight: '500', 
		color: Global._colors.FONT_GRAY, 
		textAlign: 'center', 
		margin: 15
	},
	treatBrief: {
		flex: 1, 
		borderLeftWidth: 1 / Global._pixelRatio, 
		borderLeftColor: Global._colors.IOS_SEP_LINE, 
		padding: 5, 
		paddingTop: 10, 
		paddingBottom: 10
	},
	doc: {
		fontSize: 14, 
		marginLeft: 3, 
		color: Global._colors.FONT_GRAY
	},
	notificationHolder: {
		flexDirection: 'row', 
		marginTop: 10
	},
	notification: {
		flex: 1, 
		fontSize: 14, 
		color: Global._colors.IOS_BLUE, 
		marginLeft: 5
	},
	addrHolder: {
		flex: 1, 
		flexDirection: 'row', 
		marginTop: 10, 
		borderTopColor: Global._colors.IOS_SEP_LINE, 
		borderTopWidth: 0 / Global._pixelRatio
	},
	addr: {
		flex: 1, 
		fontSize: 12, 
		color: Global._colors.FONT_GRAY
	},
});

export default OGNoticeBoard;



