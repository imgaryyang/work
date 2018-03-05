'use strict';

import React, {
    Component,
    PropTypes,
} from 'react';

import {
    View,
    Image,
    StyleSheet,
} from 'react-native';

class EasyPortrait extends Component {

    static displayName = 'EasyPortrait';
    static description = '头像组件';

    static propTypes = {

    	imageSource: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.number,
		]),

    	width: PropTypes.number.isRequired,

    	height: PropTypes.number.isRequired,

    	radius: PropTypes.number,

    	bgColor: PropTypes.string,

    	borderColor: PropTypes.string,

    	borderWidth: PropTypes.number,

    };

    static defaultProps = {
    	radius: 0,
    	bgColor: 'transparent',
    	borderColor: 'transparent',
    	borderWidth: 0,
    };

	state = {
	};

    constructor (props) {
        super(props);
    }

	componentDidMount () {
	}

	render () {

		let containerStyle = {
			width: this.props.width,
			height: this.props.height,
			backgroundColor: this.props.bgColor,
			borderColor: this.props.borderColor,
			borderWidth: this.props.borderWidth,
			borderRadius: this.props.radius,
		};

		let {style, imageSource, width, height, radius, bgColor, borderColor, borderWidth, ...otherProps} = this.props;

		let imgWidth = this.props.borderWidth > 0 ? this.props.width - 2 * this.props.borderWidth : this.props.width;
		let imgHeight = this.props.borderWidth > 0 ? this.props.height - 2 * this.props.borderWidth : this.props.height;

		let imageStyle = {
			width: imgWidth,
			height: imgHeight,
			backgroundColor: 'transparent',
			borderColor: 'transparent',
			borderWidth: this.props.borderWidth,
			borderRadius: this.props.radius,
		};
		//console.log(this.props.imageSource);
		return (
			<View style = {[containerStyle, style]} {...otherProps} >
				<Image resizeMode = 'cover' source = {this.props.imageSource} style = {imageStyle} />
			</View>
		);
	}

}

const styles = StyleSheet.create({
});

export default EasyPortrait;



