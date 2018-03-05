'use strict';
/**
 * 新闻主页面
 */

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
	Alert,
} from 'react-native';

import * as Global  from '../../../Global';
import Form 		from '../../../lib/form/EasyForm';

import NavBar       from 'rn-easy-navbar';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';

import NewsList		from './NewsList';

class NewsMain extends Component {

    static displayName = 'NewsMain';
    static description = '新闻主页面';

    form = null;

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {
			fkId: '', 
			fkType: 'H3',
			caption: '', 
			feededBy: '',
		},
		showLabel: true,
		labelPosition: 'left',
	};

    constructor (props) {
        super(props);

        this.clear 			= this.clear.bind(this);
        this.submit 		= this.submit.bind(this);
        this.onChange 		= this.onChange.bind(this);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	clear () {
		this.setState({value: {}});
	}

	submit () {
		this.props.navigator.push({
			component: NewsList, 
			hideNavBar: false, 
		    passProps: {
		    	title: '政策信息',
		    	data: this.state.value
		    },
		}); 
	}

	onChange (fieldName, fieldValue, formValue) {
		//console.log(arguments);
		this.setState({value: formValue});
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {[Global._styles.CONTAINER, {backgroundColor: '#ffffff'}]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} >

					<Form ref = {(c) => this.form = c} showLabel = {this.state.showLabel} labelPosition = {this.state.labelPosition} 
						labelWidth = {100} onChange = {this.onChange} value = {this.state.value}>

						<View style = {{borderLeftWidth: 4, borderLeftColor: 'brown', paddingLeft: 10, marginBottom: 6, marginTop: 10}} ><Text>新闻查询</Text></View>

						<Form.TextInput name = "fkId" label = "外联ID" placeholder = "请输入医院ID"   />
						<Form.TextInput name = "fkType" label = "外联类型" placeholder = "请选择新闻类型"  />
						<Form.TextInput name = "caption" label = "标题" placeholder = "请输入新闻标题(支持模糊查询)"  />
						<Form.TextInput name = "feededBy" label = "供稿人" placeholder = "请输入供稿人(支持模糊查询)"  />
					</Form>

					<View style = {{flexDirection: 'row', margin: 20, marginTop: 0, marginBottom: 40}} >
						<Button text = "清除" outline = {true} onPress = {this.clear} />
						<Separator width = {10} />
						<Button text = "查询" outline = {true} onPress = {this.submit} />
					</View>
				</ScrollView>
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
			<NavBar title = {this.props.title} 
		    	navigator = {this.props.navigator} 
				route = {this.props.route}
		    	hideBackButton = {false} 
		    	hideBottomLine = {true} />
		);
	}

}

const styles = StyleSheet.create({
	scrollView: {
		flex: 1,
	},
});

export default NewsMain;



