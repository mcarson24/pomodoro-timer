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
		          <Button title="Start" onPress={this.countdown} />
		          <Button title="Pause" onPress={this.pause} />
		        </View>
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
