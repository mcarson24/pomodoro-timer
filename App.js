import React from 'react'
import { Button, StyleSheet, TextInput, Text, Vibration, View } from 'react-native'
import { vibrate } from './utils/index.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      desiredWorkTime: 5000,
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

  isActiveTimer = timerName => {
    return this.state.activeTimer == timerName
  }

  takeABreak = () => {
    clearInterval(this.state.intervalId)
    this.setState(prevState => ({
        currentTime: prevState.desiredBreakTime
      }))
  }

  backToWork = () => {
    this.state.intervalId
    this.setState(prevState=> ({
      workTimer: prevState.desiredWorkTime
    }))
  }

  humanReadableTime = () => {
    const minutes = Math.floor(this.state.currentTime / 1000 / 60)
    const seconds = (this.state.currentTime / 1000 % 60).toString().padStart(2, '0')
  
    return `${minutes}:${seconds}`
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.timerTitle}>Work Timer:</Text>
          <Text style={styles.timer}>{this.humanReadableTime()}</Text>
          { this.state.currentTime === 0 && (
            <Button title="Switch Timer"
                    onPress={this.takeABreak} /> 
          )}
        </View>
        <View>
          <Text style={styles.timerTitle}>Break Timer:</Text>
          <Text style={styles.timer}>{this.humanReadableTime()}</Text>
          { this.state.breakTimer === 0 && (
            <Button title="Back To Work"
                    onPress={this.backToWork} /> 
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={this.countdown} />
          <Button title="Pause" onPress={this.pause} />
        </View>
  
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
