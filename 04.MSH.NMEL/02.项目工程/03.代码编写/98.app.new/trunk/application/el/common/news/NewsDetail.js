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
	ActivityIndicator,
} from 'react-native';

import PropTypes from 'prop-types';
import * as Global  from '../../../Global';

import NavBar       from 'rn-easy-navbar';
import Portrait     from 'rn-easy-portrait';
import Separator    from 'rn-easy-separator';

class NewsDetail extends Component {

    static displayName = 'NewsDetail';
    static description = '新闻详情';

    static propTypes = {
    	newsItem: PropTypes.object,
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,

		caption: this.props.newsItem['caption'],
		feededBy: this.props.newsItem['feededBy'],
		createdAt: this.props.newsItem['createdAt'],
		digest: this.props.newsItem['digest'],
		image: this.props.newsItem['image'],

		body: null,
	};

    constructor (props) {
        super(props);

        this.fetchData 				= this.fetchData.bind(this);
        this._getBasicInfo 			= this._getBasicInfo.bind(this);
        this._getNavBar 			= this._getNavBar.bind(this);
        this._renderPlaceholderView = this._renderPlaceholderView.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true}, () => {
				this.fetchData();
			});
		});
	}

	async fetchData () {
        let FIND_URL = 'el/base/news/';
        try {
	        let responseData = await this.request(Global._host + FIND_URL + this.props.newsItem.id, {
	        	method:'GET'
            });
            if(responseData.success){
				this.setState({
					caption: responseData.result.caption,
					feededBy: responseData.result.feededBy,
					createdAt: responseData.result.createdAt,
					digest: responseData.result.digest,
					image: responseData.result.image,

					body: responseData.result.body,
				});
            }
        } catch(e) {
            this.handleRequestException(e);
        }
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();
		
		var img = this.state.image ? (<Portrait 
			imageSource = {{uri: Global._host + 'el/base/images/view/' + this.state.image}} 
			bgColor = {Global._colors.IOS_GRAY_BG} 
			width = {Global.getScreen().width - 30} 
			height = {(Global.getScreen().width - 30) * (1 - 0.618)} 
		/>) : null;

		let loadingView = this.state.body ? null : 
			(
				<View style = {[Global._styles.CENTER, {padding: 20}]} >
					<ActivityIndicator style = {{marginTop: 20}} />
					<Text style = {{marginTop: 10, marginBottom: 20, color: Global._colors.FONT_LIGHT_GRAY1}} >正在载入...</Text>
				</View>
			);

		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: 'white'}]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
					{this._getBasicInfo()}

					<Text style = {[Global._styles.GRAY_FONT, {marginTop: 8}]} >{this.state.feededBy}</Text>
					<Text style = {[Global._styles.GRAY_FONT, {marginTop: 5}]} >{this.state.createdAt}</Text>
					<Text style = {[Global._styles.GRAY_FONT, {marginTop: 12, marginBottom: 12, fontSize: 14}]} >{this.state.digest}</Text>
					{img}

					{loadingView}

					<Text style = {[{marginTop: 15, fontSize: 15}]} >{this.state.body}</Text>

					<Separator height = {40} />

				</ScrollView>
			</View>
		);
	}

	_getBasicInfo () {
		return (
			<View>
				<Text style = {{fontSize: 17}} >{this.state.caption}</Text>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: 'white'}]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >
					{this._getBasicInfo()}
				</ScrollView>
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = {this.state.caption ? this.state.caption : '载入中...'} 
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
		padding: 15,
	},

});

export default NewsDetail;



