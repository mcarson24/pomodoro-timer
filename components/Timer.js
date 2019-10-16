import React from 'react'
import {Button, Text, TextInput, TouchableOpacity, StyleSheet, Vibration, View} from 'react-native'
import Constants from 'expo-constants'

export default class Timer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			workMode: true,
			desiredWorkTime: 10000,
      desiredBreakTime: 5000,
      currentTime: '',
      intervalId: '',
      showInputs: false,
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
        clearInterval(this.state.intervalId)
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

  pause = () => {
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
  	const newTimeInMilliseconds = newTime * 60 * 1000
  	this.setState({
  		desiredWorkTime: newTimeInMilliseconds,
  		currentTime: newTimeInMilliseconds
  	}) 
  	this.pause()
  }

  handleBreakTimeChange = newTime => {
  	const newTimeInMilliseconds = newTime * 60 * 1000
  	this.setState({
  		desiredBreakTime: newTimeInMilliseconds,
  		currentTime: newTimeInMilliseconds
  	})
  	this.pause()
  }

  reset = () => {
  	this.setState(prevState => ({
  		currentTime: prevState.workMode ? prevState.desiredWorkTime : prevState.desiredBreakTime,
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
					<TouchableOpacity onPress={this.switchTimer} style={[ this.state.workMode ? styles.timerToggleButtonActive : styles.timerToggleButton]}>
						<Text>Work Timer</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={this.switchTimer} style={[ this.state.workMode ? styles.timerToggleButton : styles.timerToggleButtonActive]}>
						<Text>Break Timer</Text>
					</TouchableOpacity>
				</View>
				{!this.state.showInputs && (
					<View>
						<View style={styles.timerHeader}>
			        <Text style={styles.timerTitle}>{this.title()}</Text>
			        <Text style={styles.timer}>{this.humanReadableTime()}</Text>
						</View>	
		        <View style={styles.buttonContainer}>
		          <TouchableOpacity style={styles.timerButtons} onPress={this.countdown}>
		          	<Text style={styles.timerButtonsText}>Start</Text>
	          	</TouchableOpacity>
	          	<TouchableOpacity style={styles.timerButtons} onPress={this.pause}>
	          		<Text style={styles.timerButtonsText}>Pause</Text>
	          	</TouchableOpacity>
		        </View>
		        <Button title="Reset" onPress={this.reset} />
	        </View>
				)}
        <View>
	        { this.state.currentTime === 0 && (
	          <Button title="Switch Timer"
	                  onPress={this.switchTimer} /> 
	        )}
        	<Button title="Change Times" onPress={this.toggleInputs}/>
        	{this.state.showInputs && (
        		<View>
		        	<TextInput onChangeText={this.handleWorkTimeChange}
		                   	 keyboardType="numeric"
		                   	 style={styles.inputs}
		                   	 />
			        <TextInput onChangeText={this.handleBreakTimeChange}
		                   	 keyboardType="numeric"
		                   	 style={styles.inputs}
		                   	 />
         	 	</View>
      		)}
        </View>
      </View>
		)
	}
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
	},
	timerToggleButton: {
		backgroundColor: '#5a67d8',
		padding: 10,
		paddingHorizontal: 15,
	},
	timerToggleButtonActive: {
		backgroundColor: '#383F85',
		padding: 10,
		paddingHorizontal: 15,
	},
	timerHeader: {
		alignItems: 'center'
	},
	timerTitle: {
    fontSize: 24,
    color: '#a0aec0'
  },
  timer: {
    fontSize: 56,
    color: '#fff'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '55%'
  },
  timerButtons: {
  	backgroundColor: '#5a67d8',
  	color: '#fff',
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  	paddingVertical: 15,
  	borderRadius: 5,
  	marginHorizontal: 10
  },
  timerButtonsText: {
  	color: '#FFF',
  },
  inputs: {
  	backgroundColor: '#cbd5e0',
  	marginBottom: 15,
  	padding: 5,
  	paddingVertical: 15,
  	borderRadius: 5
  }
})
