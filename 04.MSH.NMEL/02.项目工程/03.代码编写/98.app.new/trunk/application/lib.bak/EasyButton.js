'use strict';
/**
 * 公用按钮组件
 */
import React, {
    Component,

} from 'react';

import {
    Text,
    TouchableOpacity,
    PixelRatio,
} from 'react-native';


class EasyButton extends Component {

    static THEME = {
        BLUE: {
            alignItems: 'center', 
            justifyContent: 'center',
            height: 40, 
            backgroundColor: '#5bc8f3', 
            borderColor: '#5bc8f3', 
            borderWidth: 1 / PixelRatio.get(),
            borderRadius: 3,
        },
        ORANGE: {
            alignItems: 'center', 
            justifyContent: 'center',
            height: 40, 
            backgroundColor: '#FF6600', 
            borderColor: '#FF6600', 
            borderWidth: 1 / PixelRatio.get(),
            borderRadius: 3,
        },
        WHITE: {
            alignItems: 'center', 
            justifyContent: 'center',
            height: 40, 
            backgroundColor: 'white', 
            borderColor: 'white', 
            borderWidth: 1 / PixelRatio.get(),
            borderRadius: 3,
        },
        HREF: {
            alignItems: 'center', 
            justifyContent: 'flex-start',
            backgroundColor: 'transparent', 
            borderColor: 'transparent', 
            borderWidth: 0,
            borderRadius: 0,
        },
    };

    static displayName = 'EasyButton';
    static description = 'EasyButton Component';

    static propTypes = {

    	/**
    	 * 按钮文字
         * 如果props.children存在，则文字不生效
         * 否则直接将文字作为按钮内容
    	 */
    	text: PropTypes.string,

        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,

        /**
         * 按钮大小
         * default | big - 高40
         * small - 高30
         */
        size: PropTypes.string,

        /**
         * 皮肤
         */
        theme: PropTypes.object,

        /**
         * 是否边框线按钮
         * 边框线按钮不显示背景色
         */
        outline: PropTypes.bool,

        /**
         * 伸展属性，{flex: 1} when true
         */
        stretch: PropTypes.bool,

        /**
         * 清除背景色及边框
         */
        clear: PropTypes.bool,

    };

    static defaultProps = {
        disabled: false,
        theme: EasyButton.THEME.BLUE,
        outline: false,
        stretch: true,
        clear: false,
    };

    constructor (props) {
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    /**
     * 点击触发
     */
    onPress () {
        if(!this.props.disabled && typeof this.props.onPress == 'function') {
            this.props.onPress({...arguments});
        }
    }

	render () {

        let size = this.props.size ? {height: this.props.size == 'small' ? 30 : 40} : null;
        size = this.props.theme == EasyButton.THEME.HREF ? null : size;

        let stretch = this.props.stretch ? {flex: 1} : null;

        let clearContainerStyle = this.props.clear ? {backgroundColor: 'transparent', borderColor: 'transparent'} : null;
        let clearTextStyle = this.props.clear ? {color: this.props.theme.backgroundColor} : null;

        let outlineContainerStyle = this.props.outline ? {backgroundColor: 'transparent'} : null;
        let outlineTextStyle = this.props.outline ? {color: this.props.theme.backgroundColor} : null;

        let disabledContainerStyle = this.props.disabled ? 
            {backgroundColor: '#C8C7CC', borderColor: '#C8C7CC'} : 
            null;
        let disabledTextStyle = this.props.disabled ? 
            {color: '#929292'} : 
            null;

		let { style, onPress, ...other } = this.props;

        let textColor = this.props.theme == EasyButton.THEME.WHITE ? 
            {color: 'white'} : 
            (
                this.props.theme == EasyButton.THEME.HREF ? 
                {color: 'rgba(0,122,255,1)'} : 
                {color: 'white'}
            );

        let content = this.props.children ? 
            this.props.children : 
            <Text 
                style={[{fontSize: 14}, textColor, outlineTextStyle, clearTextStyle, disabledTextStyle]} >
                {this.props.text}
            </Text>

		return (
			<TouchableOpacity 
                style = {[
                    this.props.theme, 
                    outlineContainerStyle, 
                    size, 
                    stretch, 
                    clearContainerStyle,
                    disabledContainerStyle, 
                    ].concat(style)} 
                onPress = {this.onPress} 
                {...other} 
            >
				{content}
			</TouchableOpacity>
		);
	}

}

export default EasyButton;



