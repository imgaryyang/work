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
	ListView,
} from 'react-native';

import * as Global  from '../../Global';

import NavBar       from 'rn-easy-navbar';
import EasyIcon     from 'rn-easy-icon';
import Separator    from 'rn-easy-separator';

import CashierDesk 	from './CashierDesk';

class SampleMenu extends Component {

	menu = [
		{text: '消费', component: CashierDesk},
		{text: '充值', component: null},
	];

    static displayName = 'SampleMenu';
    static description = '样例列表';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		dataSource: new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		}).cloneWithRows(this.menu),
	};

    constructor (props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	renderRow (item, sectionID, rowID, highlightRow) {
		return (
			<TouchableOpacity key = {item} 
				style = {[Global._styles.CENTER, {flexDirection: 'row', padding: 20}]}
				onPress = {() => {
					// if (item.component == null ) {
					// 	this.toast('即将开通');
					// 	return null;
					// }
					this.props.navigator.push({
					component: item.component,
					hideNavBar: true,
					passProps: {
						orderId: '8a8c7da155a44a7a0155a44c62270006',
						callback: null,
						backRoute: this.props.route,
					}
				})}} >
				<Text style = {{flex: 1}} >{item.text}</Text>
				<EasyIcon name = "ios-arrow-forward-outline" size = {20} color = {Global._colors.FONT_LIGHT_GRAY1} />
			</TouchableOpacity>
		);
	}

	/**
	 * 渲染行分割线
	 */
	renderSeparator (sectionId, rowId) {
		return <View key={'sep_' + rowId} style={Global._styles.FULL_SEP_LINE} />;
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]} >
				{this._getNavBar()}
				<ListView 
					style = {styles.list} 
				    dataSource = {this.state.dataSource} 
					renderRow = {this.renderRow} 
					enableEmptySections = {true}
    				renderSeparator = {this.renderSeparator} 
				/>
			</View>
		);
	}

	_renderPlaceholderView () {
		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]}>
			    {this._getNavBar()}
			</View>
		);
	}

	_getNavBar () {
		return (
			<NavBar title = '收银台' 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {false} />
		);
	}

}

const styles = StyleSheet.create({
	list: {
		backgroundColor: '#ffffff',
	},
});

export default SampleMenu;



