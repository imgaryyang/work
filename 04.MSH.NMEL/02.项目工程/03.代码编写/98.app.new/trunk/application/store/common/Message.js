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
	TextInput,
} from 'react-native';

class Message extends Component {

    static displayName = 'Message';
    static description = '显示信息';

    static propTypes = {
    };

    static defaultProps = {
    };

	state = {
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
	}
	
	render () {
		return (
			<View style={styles.message}>
	    		<Text>{this.props.text || ''}</Text>
	    	</View>
		);
	}

}

const styles = StyleSheet.create({
	message: {
    	height: 45,
    	alignItems: 'center',
    	justifyContent: 'center',
    },
});

export default Message;



