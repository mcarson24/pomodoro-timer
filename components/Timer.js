import React from 'react'
import {Button, Text, TextInput, TouchableOpacity, StyleSheet, Vibration, View} from 'react-native'
import Constants from 'expo-constants'

const START_TIME_WORK = 25 * 60 * 1000
const START_TIME_BREAK = 5 * 60 * 1000

export default class Timer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			workMode: true,
			desiredWorkTime: START_TIME_WORK,
      desiredBreakTime: START_TIME_BREAK,
      currentTime: '',
      intervalId: '',
      showInputs: false,
      timerIsActive: false,
		}
	}

  componentDidMount() {
    this.setState(prevState=> ({
      currentTime: prevState.desiredWorkTime
    }))
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

  updateCurrentTime = () => {
  	if (this.state.workMode) {
  		this.setState(prevState => ({
  			currentTime: prevState.desiredWorkTime
  		}))
  	} else {
  		this.setState(prevState => ({
  			currentTime: prevState.desiredBreakTime
  		}))
  	}
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
  	const newTimeInMilliseconds = newTime * 60 * 1000

  	this.setState(prevState => ({
  		desiredWorkTime: newTimeInMilliseconds,
  		currentTime: prevState.workMode ? newTimeInMilliseconds : prevState.currentTime
  	}) )
  	this.pause()
  }

  handleBreakTimeChange = newTime => {
  	newTime = parseInt(newTime)
  	if (newTime === 0) return
  	const newTimeInMilliseconds = newTime * 60 * 1000

  	this.setState(prevState => ({
  		desiredBreakTime: newTimeInMilliseconds,
  		currentTime: !prevState.workMode ? newTimeInMilliseconds : prevState.currentTime
  	}))
  	this.pause()
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
			<View style={styles.timerContainer}>
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
						<View style={styles.timerHeader}>
			        <Text style={styles.timerTitle}>{this.title()}</Text>
			        <Text style={styles.timer}>{this.humanReadableTime()}</Text>
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
			        <TouchableOpacity onPress={this.reset}
			        									style={styles.reset}>
			        	<Text style={styles.resetText}>Reset</Text>
		        	</TouchableOpacity>
	        	</View>
	        </View>
				)}
        <View style={{width: '100%', flexDirection: 'column', alignItems: 'center'}}>
        	{this.state.showInputs && (
        		<View >
	        		<Text style={styles.inputLabels}>Work Time 
	        			<Text style={{fontSize: 12}}>(in minutes)</Text>:
        			</Text>
		        	<TextInput onChangeText={this.handleWorkTimeChange}
		                   	 keyboardType="numeric"
		                   	 style={styles.inputs}
		                   	 placeholder={(this.state.desiredWorkTime / 1000 / 60).toString()}
		                   	 placeholderTextColor="#000"
		                   	 />
	        		<Text style={styles.inputLabels}>Break Time
	        			<Text style={{fontSize: 12}}>(in minutes)</Text>:
	        		</Text>
			        <TextInput onChangeText={this.handleBreakTimeChange}
		                   	 keyboardType="numeric"
		                   	 style={styles.inputs}
		                   	 placeholder={(this.state.desiredBreakTime / 1000 / 60).toString()}
		                   	 placeholderTextColor="#000"
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

const colors = {
	indigo: '#5a67d8',
	indigoDarker: '#383F85',
	white: '#fff',
	grayLighter: '#edf2f7',
	grayDarker: '#a0aec0'
}

const styles = StyleSheet.create({
	timerContainer: {
		marginTop: Constants.statusBarHeight,
		width: '85%',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	timerToggles: {
		flexDirection: 'row',
		borderRadius: 5,
		overflow: 'hidden'
	},
	timerToggleButton: {
		padding: 10,
		paddingHorizontal: 15,
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
	timerHeader: {
		alignItems: 'center'
	},
	timerTitle: {
    fontSize: 24,
    color: colors.grayDarker
  },
  timer: {
    fontSize: 56,
    color: colors.white
  },
  resetContainer: {
  	flexDirection: 'row', 
  	justifyContent: 'center',
  	paddingTop: 10,
  },
  reset: {
  	padding: 10,
  },
  resetText: {
  	color: colors.grayDarker,
  	fontSize: 16,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '55%'
  },
  timerButtons: {
  	backgroundColor: colors.indigo,
  	color: colors.white,
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  	paddingVertical: 15,
  	borderRadius: 5,
  	marginHorizontal: 10
  },
  timerButtonsText: {
  	color: colors.white,
  	fontSize: 18,
  },
  inputs: {
  	backgroundColor: colors.grayLighter,
  	marginBottom: 15,
  	padding: 5,
  	paddingVertical: 15,
  	borderRadius: 5,
  	width: 200,
  	fontSize: 16,
  	paddingLeft: 15
  },
  inputLabels: {
  	fontSize: 20,
  	marginBottom: 10,
  	color: colors.grayDarker
  },
  updateButton: {
  	color: colors.grayLighter, 
  	marginBottom: Constants.statusBarHeight / 2, 
  	fontSize: 18
  },
})
