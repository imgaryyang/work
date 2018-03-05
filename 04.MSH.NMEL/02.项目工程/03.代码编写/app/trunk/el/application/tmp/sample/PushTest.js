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
	Alert,
} from 'react-native';

import * as Global  from '../../Global';
import Form 		from '../../lib/form/EasyForm';
import FormConfig 	from '../../lib/form/config/LineInputsConfig';

import NavBar       from 'rn-easy-navbar';
import Icon 		from 'rn-easy-icon';
import Button       from 'rn-easy-button';
import Separator    from 'rn-easy-separator';
import Card    		from 'rn-easy-card';

import JPush , {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush';

class PushTest extends Component {

    static displayName = 'PushTest';
    static description = '组件';

    form = null;

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
		doRenderScene: false,
		value: {
			name: 'Victor', 
			age: '99',
		},
		showLabel: true,
		labelPosition: 'left',
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
		InteractionManager.runAfterInteractions(() => {
			this.setState({doRenderScene: true});
		});
	}

	resumePush() {
		JPush.resumePush();
	}

	stopPush () {
		JPush.stopPush();
	}

	clearAllNotifications() {
		JPush.clearAllNotifications();
	}

	render () {
		if(!this.state.doRenderScene)
			return this._renderPlaceholderView();

		return (
			<View style = {[Global._styles.CONTAINER]} >
				{this._getNavBar()}
				<ScrollView style = {styles.scrollView} keyboardShouldPersistTaps = {true} >

					<View style = {{margin: 20, marginTop: 0, marginBottom: 40}} >
						<Button text = "停止推送" onPress = {()=>this.stopPush()} />
						<Separator width = {10} height={20}/>
						<Button text = "恢复推送" onPress = {()=>this.resumePush()} />
						<Separator width = {10} height={20}/>
						<Button text = "清除通知" onPress = {()=>this.clearAllNotifications()} />
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
			<NavBar title = 'Easy Form - Line Inputs' 
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
		paddingTop:20
	},

	fieldSet: {
		borderLeftWidth: 4, 
		borderLeftColor: 'brown', 
		paddingLeft: 10,
		paddingTop: 15,
		paddingBottom: 15, 
		backgroundColor: Global._colors.IOS_GRAY_BG,
	},
});

export default PushTest;



