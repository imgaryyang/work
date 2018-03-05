'use strict';
/**
 * 绑定卡 步骤样式
 */
import React, {
    Component,
} from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import * as Global  from '../../Global';
class BindStep extends Component {
    constructor (props) {
        super(props);
    }
	render () {
		let num = this.props.num;
		return (
			<View style={styles.navView}>
				<View style={[styles.navNumView,(num==1) && styles.navSelect]}><Text style={styles.navNumText}>1</Text></View>
				<Text style={styles.navText}>卡号</Text>
				<View style={[styles.navNumView,(num==2) && styles.navSelect]}><Text style={styles.navNumText}>2</Text></View>
				<Text style={styles.navText}>认证信息</Text>
				<View style={[styles.navNumView,(num==3) && styles.navSelect]}><Text style={styles.navNumText}>3</Text></View>
				<Text style={styles.navText}>验证码</Text>
				<View style={[styles.navNumView,(num==4) && styles.navSelect]}><Text style={styles.navNumText}>4</Text></View>
				<Text style={styles.navText}>完成</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	navView: {
		flex: 2,
		height: 44,
		flexDirection : 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	navNumView: {
		height:14,
		width:14,
		backgroundColor: Global._colors.IOS_BLUE, 
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft:7,
		marginRight:1,
	},
	navNumText: {
		color:'#ffffff',
		fontSize: 13,
		lineHeight: 18,
	},
	navText: {
		lineHeight: 18,
		fontSize: 13,
	},
	navSelect: {
		backgroundColor: Global._colors.ORANGE, 
	},
});

export default BindStep;

