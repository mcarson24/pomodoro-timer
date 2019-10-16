import React from 'react'
import {Button, Text, TextInput, StyleSheet, Vibration, View} from 'react-native'

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
      timerIsActive: false,
		}
	}

  componentDidMount() {
    this.setState(prevState=> ({
      currentTime: prevState.desiredWorkTime
    }))
  }

  countdown = () => {
  	if (this.state.timerIsActive) return

    const intervalId = setInterval(() => {
      if (this.state.currentTime === 0) {
        Vibration.vibrate([500, 500, 500])
        this.setState({timerIsActive: false})
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

  startTimer = () => {
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
  	console.log(newTime)
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
  	console.log(newTime)
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
			<View>
				{!this.state.showInputs && (
					<View>
		        <Text style={styles.timerTitle}>{this.title()}</Text>
		        <Text style={styles.timer}>{this.humanReadableTime()}</Text>
		        <View style={styles.buttonContainer}>
		          <Button title="Start" onPress={this.startTimer} />
		          <Button title="Pause" onPress={this.pause} />
		        </View>
		        <Button title="Reset" onPress={this.reset} />
	        </View>
				)}
        { this.state.currentTime === 0 && (
          <Button title="Switch Timer"
                  onPress={this.switchTimer} /> 
        )}
        <View>
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
	timerTitle: {
    fontSize: 24
  },
  timer: {
    fontSize: 56
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  inputs: {
  	backgroundColor: '#cbd5e0',
  	marginBottom: 15,
  	padding: 5,
  	paddingVertical: 15,
  	borderRadius: 5
  }
})
