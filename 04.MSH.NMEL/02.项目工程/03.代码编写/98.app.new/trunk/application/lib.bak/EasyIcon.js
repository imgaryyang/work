'use strict';
/**
 * 带背景的ICON
 */
import React, {
    Component,

} from 'react';

import {
	View,
} from 'react-native';

import Entypo           from 'react-native-vector-icons/Entypo';
import EvilIcons        from 'react-native-vector-icons/EvilIcons';
import FontAwesome      from 'react-native-vector-icons/FontAwesome';
import Foundation       from 'react-native-vector-icons/Foundation';
import Ionicons         from 'react-native-vector-icons/Ionicons';
import MaterialIcons    from 'react-native-vector-icons/MaterialIcons';
import Octicons         from 'react-native-vector-icons/Octicons';
import Zocial           from 'react-native-vector-icons/Zocial';

class EasyIcon extends Component {

    static displayName = 'EasyIcon';
    static description = 'EasyIcon Component';

    iconLib = {
        Entypo:         Entypo,
        EvilIcons:      EvilIcons,
        FontAwesome:    FontAwesome,
        Foundation:     Foundation,
        Ionicons:       Ionicons,
        MaterialIcons:  MaterialIcons,
        Octicons:       Octicons,
        Zocial:         Zocial,
    };

    iconLibAlias = {
        et: Entypo,
        ei: EvilIcons,
        fa: FontAwesome,
        fd: Foundation,
        ii: Ionicons,
        mi: MaterialIcons,
        oi: Octicons,
        zi: Zocial,
    };

    static propTypes = {

        /**
         * 使用的Icon库名称
         * 可空，空时默认使用Ionicons
         */
        iconLib: PropTypes.string,

    	/**
    	 * Icon名称
    	 */
    	name: PropTypes.string.isRequired,

        /**
         * Icon颜色
         */
        color: PropTypes.string,

        /**
         * Icon大小
         */
        size: PropTypes.number,

        /**
         * Icon背景色
         * 如果背景需要透明效果，请使用rgba
         */
        bgColor: PropTypes.string,

        /**
         * 边框颜色
         */
        borderColor: PropTypes.string,

        /**
         * 边框大小
         */
        borderWidth: PropTypes.number,

        /**
         * 背景宽度
         */
        width: PropTypes.number,

        /**
         * 背景高度
         */
        height: PropTypes.number,

        /**
         * 圆角大小
         */
        radius: PropTypes.number,

    };

    static defaultProps = {
        iconLib: 'Ionicons',
        color: 'black',
        size: 18,
        width: 18,
        height: 18,
    };

    constructor (props) {
        super(props);
    }

	render () {

        let width       = this.props.width ? {width: this.props.width} : null;
        let height      = this.props.height ? {height: this.props.height} : null;
        let bg          = this.props.bgColor ? {backgroundColor: this.props.bgColor} : null;
        let borderWidth = this.props.borderWidth ? {borderWidth: this.props.borderWidth} : null;
        let borderColor = this.props.borderColor ? {borderColor: this.props.borderColor} : null;
        let radius      = this.props.radius ? {borderRadius: this.props.radius} : null;
        //let lineHeight  = this.props.height - (this.props.height - this.props.size) / 2;
        //let paddingTop  = (this.props.height - this.props.size) / 2;

        let { style, ...other } = this.props;
        style = Array.isArray(style) ? style : [style];
        //console.log(style);

        let _styles = [width, height, bg, borderWidth, borderColor, radius]
            .concat(style)
            .concat([{alignItems: 'center', justifyContent: 'center'}]);
        //console.log(_styles);

        let Icon = this.iconLib[this.props.iconLib] ? 
            this.iconLib[this.props.iconLib] : 
            (
                this.iconLibAlias[this.props.iconLib] ? 
                this.iconLibAlias[this.props.iconLib] : 
                null
            );

        if(Icon)
    		return (
                <View style = {_styles} {...other} >
                    <Icon 
                        name    = {this.props.name} 
                        color   = {this.props.color} 
                        size    = {this.props.size} 
                        style   = {{textAlign: 'center'}}
                    />
                </View>
            );
        else
            return (
                <View 
                    style   = {_styles}
                    {...other} 
                />
            );
	}

}

export default EasyIcon;



