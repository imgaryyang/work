'use strict';
/**
 * 新闻主页面
 */
import React, {
    Component,
} from 'react';

import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import * as Global  from '../../../Global';
import FAIcon       from 'react-native-vector-icons/FontAwesome';

class News extends Component {
    constructor (props) {
        super(props);
        this.state = {
        	cardTypeName: '',
        };
    }
    
	render () {
		return (
			<View>
				<TouchableOpacity 
					style={[styles.cardStyle]}
					navigator = {this.props.navigator}  
					route = {this.props.route}
			    	onPress={() => this._newsDetail()}>
			    	<Image style={[styles.image]} source={{uri:this.props.image}} />
			    	<View style={styles.cardDataView}>
						<Text style={[styles.caption,styles.font1Color]}>{this.props.caption}</Text>
						<Text style={[styles.digest,styles.font3Color]}>{'摘要:'+this.props.digest}</Text>
						<Text style={[styles.digest,styles.font3Color]}>{'发布时间:'+this.props.createdAt}</Text>
				    </View>
				</TouchableOpacity>
				<View style={styles.line}>
				</View>
			</View>
		);		
	}
	_newsDetail () {
  		const {onPress} = this.props;
  		onPress();
	}
}

const styles = StyleSheet.create({
	cardStyle: {
		flex: 1,
		backgroundColor:'white',
		height:250,
		marginTop:3,
	},
	image: {
		width: 350,
		height: 85,
	},
	cardDataView: {
		flex: 1,
		marginLeft:2,
	},
	cardTextView: {
		flex: 1,
		justifyContent:'flex-start',
		flexDirection: 'row',
	},
	font1Color: {
		color: '#000000',
	},
	font2Color: {
		color: '#CC3300',
	},
	font3Color: {
		color: '#BBBBBB',
	},
	caption: {
		fontSize: 18,
		textAlign:'left',
	},
	digest: {
		textAlign:'left',
		fontSize: 16,
	},
	line: {
		height:10,
		backgroundColor:'#EEEEEE'
	}
});

export default News;

