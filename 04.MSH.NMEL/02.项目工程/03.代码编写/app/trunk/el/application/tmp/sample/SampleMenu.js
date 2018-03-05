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

import SampleList 			from './SampleList';
import ComponentTest 		from './ComponentTest';
import EasyFormTest1 		from './EasyFormTest1';
import LineInputsFormTest 	from './LineInputsFormTest';
import LineInputsFormTest1 	from './LineInputsFormTest1';
import PushTest 	from './PushTest';

class SampleMenu extends Component {

	menu = [
		{text: '列表测试', component: SampleList},
		{text: '组件测试', component: ComponentTest},
		{text: 'Easy Form - Default configuration', component: EasyFormTest1},
		{text: 'Easy Form - Line Inputs Form', component: LineInputsFormTest},
		{text: 'Easy Form - Line Inputs Form 1', component: LineInputsFormTest1},
		{text: '推送测试', component: PushTest},
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
				onPress = {() => this.props.navigator.push({
					component: item.component,
					hideNavBar: true,
				})} >
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
			<NavBar title = 'Sample List' 
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



