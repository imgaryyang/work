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
	MapView,
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


const FIND_CONTACT_URL 	= 'el/base/contact/all';
const IMAGES_URL 		= 'el/base/images/view/';

class HospHome extends Component {

    static displayName = 'HospHome';
    static description = '医院主页';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		_refreshing: true,//控制刷新
		_pullToRefreshing: false,//控制下拉刷新
	};

    constructor (props) {
        super(props);

        this.fetchContcatData	= this.fetchContcatData.bind(this);
        this.renderContacts		= this.renderContacts.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
			this.fetchContcatData();
		});
	}

	/**
	 * 异步加载数据
	 */
	async fetchContcatData () {

		try {
			let data = encodeURI(JSON.stringify({
	            	fkId: this.props.hosp.id,
	            	fkType: "hospital",
	        }));
			let responseData = await this.request(Global._host + FIND_CONTACT_URL + '?data=' + data, {
				method : "GET"
			});

			this.setState({
				contacts: responseData.result,
			});
		} catch(e) {
			this.handleRequestException(e);
		}
	}

	render () {

		let mapView = this.props.hosp.latitude && this.props.hosp.longitude ? 
			(
				<MapView 
					style = {styles.map}
					region = {{
						latitude: this.props.hosp.latitude,
    					longitude: this.props.hosp.longitude,
    					latitudeDelta: .01,		//地图显示范围，距中点的横向距离
    					longitudeDelta: .01,	//地图显示范围，距中点的纵向距离
					}}
					annotations = {[{
						latitude: this.props.hosp.latitude,
    					longitude: this.props.hosp.longitude,
    					title: this.props.hosp.name,
					}]}
				/>
			) : null;

		return (
			<View style = {Global._styles.CONTAINER} >
				<Card >
					<View style = {Global._styles.CARD_TITLE} >
						<Text style = {Global._styles.CARD_TITLE_TEXT} >地址</Text>
					</View>
					<View style = {[{flexDirection: 'row', marginTop: 5, marginBottom: 5}, Global._styles.CENTER]} >
						<EasyIcon name = "ios-pin" size = {13} color = {Global._colors.FONT_LIGHT_GRAY1} />
						<Text style = {{flex: 1, fontSize: 12, color: Global._colors.FONT_GRAY}} >{this.props.hosp.elhOrg ? this.props.hosp.elhOrg.address : null}</Text>
					</View>
					{mapView}
				</Card>
				<Separator height = {10} />

				{this.renderContacts()}
				<Separator height = {10} />

				<Card >
					<View style = {Global._styles.CARD_TITLE} >
						<Text style = {Global._styles.CARD_TITLE_TEXT} >交通方式</Text>
					</View>
					<Text style = {[Global._styles.GRAY_FONT, {marginTop: 8, lineHeight: 17}]} >{this.props.hosp.transport}</Text>
				</Card>
				<Separator height = {10} />

				<Card >
					<View style = {Global._styles.CARD_TITLE} >
						<Text style = {Global._styles.CARD_TITLE_TEXT} >医院简介</Text>
					</View>
					<Text style = {[Global._styles.GRAY_FONT, {marginTop: 8, lineHeight: 17}]} >{this.props.hosp.description}</Text>
				</Card>
				<Separator height = {40} />

			</View>
		);
	}

	renderContacts() {
		if(!this.state.contacts || this.state.contacts.length==0){
			return null;
		}
		return(
			<Card >
				<View style = {Global._styles.CARD_TITLE} >
					<Text style = {Global._styles.CARD_TITLE_TEXT} >联系方式</Text>
				</View>
				<View>
					{this.state.contacts.map((contact, idx) => {
						return <Text key = {'contact_' + idx} style = {[Global._styles.GRAY_FONT, {marginTop: 8}]} ><B>{Filters.filterContactWay(contact.type)} : </B>{contact.content}</Text>
					})}
				</View>
			</Card>
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},

	map: {
		width: Global.getScreen().width - 30,
		height: 120,
		borderWidth: 1 / Global._pixelRatio,
		borderColor: '#000000',
	},
});

export default HospHome;



