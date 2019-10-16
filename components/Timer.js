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
      intervalId: ''
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
  	this.setState({
  		desiredWorkTime: newTime
  	}) 
  }

  handleBreakTimeChange = newTime => {
  	this.setState({
  		desiredBreakTime: newTime
  	})
  }

	render() {
		return (
			<View>
        <Text style={styles.timerTitle}>{this.title()}</Text>
        <Text style={styles.timer}>{this.humanReadableTime()}</Text>
        { this.state.currentTime === 0 && (
          <Button title="Switch Timer"
                  onPress={this.switchTimer} /> 
        )}
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={this.countdown} />
          <Button title="Pause" onPress={this.pause} />
        </View>
        <View>
        	<TextInput value={this.state.desiredWorkTime.toString()} 
                   	 onChangeText={this.handleWorkTimeChange}
                   	 keyboardType="numeric"
                   	 />
	        <TextInput value={this.state.desiredBreakTime.toString()} 
                   	 onChangeText={this.handleBreakTimeChange}
                   	 keyboardType="numeric"
                   	 />
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
})
