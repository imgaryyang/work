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

import ScrollableTabView from 'react-native-scrollable-tab-view';

import * as Global  from '../../Global';
import EasyIcon     from 'rn-easy-icon';
import NavBar       from 'rn-easy-navbar';
import NewsList 	from '../../el/common/news/NewsList';

class News extends Component {

    static displayName = 'News';
    static description = '公共资讯';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		let n1Data = {fkType: 'H3'};
		if(Global.Config['_HOSP_ID']) n1Data['fkId'] = Global.Config['_HOSP_ID'];
		let n2Data = {fkType: 'H4'};
		if(Global.Config['_HOSP_ID']) n2Data['fkId'] = Global.Config['_HOSP_ID'];
		console.log(n1Data, n2Data);
		return (
			<View style = {Global._styles.CONTAINER} >
				{this._getNavBar()}
				<ScrollableTabView 
					tabBarBackgroundColor = "white" 
					tabBarUnderlineColor = {Global._colors.ORANGE}
					//tabBarTextStyle = {{color: Global._colors.FONT_GRAY}}
					tabBarActiveTextColor = {Global._colors.ORANGE} >

					<NewsList tabLabel = "政策信息" data = {n1Data} typeText = '政策' loadingText = '正在载入政策信息...' navigator = {this.props.navigator} />
					<NewsList tabLabel = "健康指导" data = {n2Data} typeText = '健康指导' loadingText = '正在载入健康指导信息...' navigator = {this.props.navigator} />

				</ScrollableTabView>
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
			<NavBar title = '公共资讯' 
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
});

export default News;



