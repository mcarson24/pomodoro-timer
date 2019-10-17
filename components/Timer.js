import React from 'react'
import TimeInput from './TimeInput.js'
import Constants from 'expo-constants'
import colors from '../utils/colors.js'
import {Button, Text, TextInput, TouchableOpacity, StyleSheet, Vibration, View} from 'react-native'

const START_TIME_WORK = 25 * 60 * 1000
const START_TIME_BREAK = 5 * 60 * 1000

export default class Timer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			workMode: true,
			desiredWorkTime: START_TIME_WORK,
      desiredBreakTime: START_TIME_BREAK,
      currentTime: START_TIME_WORK,
      intervalId: '',
      showInputs: false,
      timerIsActive: false,
		}
	}

  countdown = () => {
    const intervalId = setInterval(() => {
      if (this.state.currentTime === 0) {
        Vibration.vibrate([500, 500, 500])
        this.setState({timerIsActive: false})
        clearInterval(this.state.intervalId)
        this.switchTimer()
        return
      }
      this.setState(prevState => ({
        currentTime: prevState.currentTime - 1000
      }))
    }, 1000)
    this.setState({
      intervalId
    })
  }

  startTimer = () => {
  	if (this.state.timerIsActive) return
		
  	this.setState({
  		timerIsActive: true
  	})
  	this.countdown()
  }

  pause = () => {
  	this.setState({
  		timerIsActive: false
  	})
    clearInterval(this.state.intervalId)
  }

  humanReadableTime = () => {
    const minutes = Math.floor(this.state.currentTime / 1000 / 60)
    const seconds = (this.state.currentTime / 1000 % 60).toString().padStart(2, '0')
  
    return `${minutes}:${seconds}`
  }

  switchTimer = () => {
  	clearInterval(this.state.intervalId)

  	this.setState(prevState => ({
      currentTime: prevState.workMode ? prevState.desiredBreakTime : prevState.desiredWorkTime,
      workMode: !prevState.workMode,
    }))
  }

  title = () => {
  	return this.state.workMode ? 'Work Timer' : 'Break Timer'
  }

  handleWorkTimeChange = newTime => {
  	newTime = parseInt(newTime)
  	if (newTime === 0) return
  	const oldTime = this.state.currentTime
  	const newTimeInMilliseconds = newTime * 60 * 1000

  	this.setState(prevState => {
  		let timeToSave = oldTime
  		if (prevState.workMode) timeToSave = newTimeInMilliseconds
			if (isNaN(newTimeInMilliseconds)) timeToSave = oldTime
  		return {
	  		desiredWorkTime: newTimeInMilliseconds,
	  		currentTime: timeToSave
  		}
  	})
  	if (this.state.workMode) this.pause()
  }

  handleBreakTimeChange = newTime => {
  	newTime = parseInt(newTime)
  	if (newTime === 0) return
  	const oldTime = this.state.currentTime
  	const newTimeInMilliseconds = newTime * 60 * 1000
  	this.setState(prevState => {
  		let timeToSave = oldTime
  		if (!prevState.workMode) timeToSave = newTimeInMilliseconds
			if (isNaN(newTimeInMilliseconds)) timeToSave = oldTime
  		return {
	  		desiredBreakTime: newTimeInMilliseconds,
	  		currentTime: timeToSave
  		}
  	})
  	if (!this.state.workMode) this.pause()
  }

  reset = () => {
  	this.setState(prevState => ({
  		currentTime: prevState.workMode ? prevState.desiredWorkTime : prevState.desiredBreakTime,
  		timerIsActive: false
  	}))
  	this.pause()
  }

  toggleInputs = () => {
  	this.setState(prevState => ({
  		showInputs: !prevState.showInputs
  	}))
  }

	render() {
		return (
			<View style={[styles.center, styles.timerContainer]}>
				<View style={styles.timerToggles}>
					<TouchableOpacity onPress={this.switchTimer} disabled={this.state.workMode}
														style={[styles.timerToggleButton, this.state.workMode ? styles.timerToggleButtonActive : styles.timerToggleButtonInactive]}>
						<Text style={styles.timerToggleButtonText}>Work Timer</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.switchTimer}  disabled={!this.state.workMode}
														style={[styles.timerToggleButton, this.state.workMode ? styles.timerToggleButtonInactive : styles.timerToggleButtonActive]}>
						<Text style={styles.timerToggleButtonText}>Break Timer</Text>
					</TouchableOpacity>
				</View>
				{!this.state.showInputs && (
					<View>
						<View style={styles.center}>
			        <Text style={styles.timerTitle}>{this.title()}</Text>
			        <Text style={styles.timeDisplay}>{this.humanReadableTime()}</Text>
						</View>	
		        <View style={styles.buttonContainer}>
		          <TouchableOpacity style={styles.timerButtons} onPress={this.startTimer}>
		          	<Text style={styles.timerButtonsText}>Start</Text>
	          	</TouchableOpacity>
	          	<TouchableOpacity style={styles.timerButtons} onPress={this.pause}>
	          		<Text style={styles.timerButtonsText}>Pause</Text>
	          	</TouchableOpacity>
		        </View>
		        <View style={styles.resetContainer}>
			        <TouchableOpacity onPress={this.reset}>
			        	<Text style={styles.resetText}>Reset</Text>
		        	</TouchableOpacity>
	        	</View>
	        </View>
				)}
        <View style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
        	{this.state.showInputs && (
        		<View >
        			<TimeInput onUpdateTime={this.handleWorkTimeChange}
        								 label="Work Time"
        								 placeholder={this.state.desiredWorkTime} 
        								 />
        			<TimeInput onUpdateTime={this.handleBreakTimeChange}
        								 label="Break Time"
        								 placeholder={this.state.desiredBreakTime}
        								 />
         	 	</View>
      		)}
      		<TouchableOpacity onPress={this.toggleInputs}>
      			<Text style={styles.updateButton}>
      				{this.state.showInputs ? 'Save Times' : 'Update Times'}
      			</Text>
      		</TouchableOpacity>
        </View>
        {this.state.showInputs && (<View></View>)}
      </View>
		)
	}
}

const styles = StyleSheet.create({
	center: {
		alignItems: 'center'
	},
	timerContainer: {
		marginTop: Constants.statusBarHeight,
		flex: 1,
		justifyContent: 'space-between',
	},
	timerToggles: {
		flexDirection: 'row',
		borderRadius: 5,
		overflow: 'hidden'
	},
	timerToggleButton: {
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	timerToggleButtonText: {
		color: colors.grayLighter,
	},
	timerToggleButtonInactive: {
		backgroundColor: colors.indigo,
	},
	timerToggleButtonActive: {
		backgroundColor: colors.indigoDarker,
	},
	timerTitle: {
    fontSize: 24,
    color: colors.grayDarker
  },
  timeDisplay: {
    fontSize: 56,
    color: colors.white,
  },
  resetContainer: {
  	flexDirection: 'row', 
  	justifyContent: 'center',
  	marginTop: 10,
  },
  resetText: {
  	color: colors.grayDarker,
  	fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '55%'
  },
  timerButtons: {
  	backgroundColor: colors.indigo,
  	color: colors.white,
  	flex: 1,
  	alignItems: 'center',
  	paddingVertical: 15,
  	borderRadius: 5,
  	marginHorizontal: 10
  },
  timerButtonsText: {
  	color: colors.white,
  	fontSize: 18,
  },
  updateButton: {
  	color: colors.grayLighter, 
  	marginBottom: Constants.statusBarHeight / 2, 
  	fontSize: 18
  },
})
