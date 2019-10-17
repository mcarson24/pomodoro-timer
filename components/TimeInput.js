import React from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import colors from '../utils/colors.js'

export default class TimeInput extends React.Component {
	static propTypes = {
		onUpdateTime: PropTypes.func.isRequired,
		placeholder: PropTypes.number.isRequired,
		label: PropTypes.string.isRequired,
	}

	timeAsString = () => {
		const timeToDisplay = (this.props.placeholder / 1000 / 60)
		
		if (isNaN(timeToDisplay)) return ''

		return timeToDisplay.toString()
	}

	render() {
		return (
			<View>
				<Text style={styles.inputLabels}>{this.props.label} 
	  			<Text style={{fontSize: 12}}>(in minutes)</Text>:
				</Text>
				<TextInput onChangeText={this.props.onUpdateTime}
	             	   keyboardType="numeric"
	             	   style={styles.inputs}
	             	   placeholder={this.timeAsString()}
	             	   placeholderTextColor="#000"
	             	   value={this.timeAsString()}
	             	   />
 	   	</View>
		)
	}
}

const styles = StyleSheet.create({
	inputs: {
  	backgroundColor: colors.grayLighter,
  	marginBottom: 15,
  	padding: 5,
  	paddingVertical: 15,
  	borderRadius: 5,
  	fontSize: 16,
  	paddingLeft: 15
  },
  inputLabels: {
  	fontSize: 20,
  	marginBottom: 10,
  	color: colors.grayDarker
  },
})
 
