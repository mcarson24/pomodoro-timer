import React from 'react'
import { Button, StyleSheet, Text, Vibration, View } from 'react-native'
import { vibrate } from './utils/index.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      desiredWorkTime: 5000,
      desiredBreakTime: 5000,
      activeTimer: 'workTimer',
      workTimer: 2000,
      breakTimer: 5000,
      workTimerIntervalId: '',
      breakTimerIntervalId: '',
    }
  }
  countdown = () => {
    const intervalId = setInterval(() => {
      if (this.state[this.state.activeTimer] === 0) {
        Vibration.vibrate([500, 500, 500])
        clearInterval(this.state[this.state.activeTimer + 'IntervalId'])
        return
      }
      this.setState(prevState => ({
        [this.state.activeTimer]: prevState[this.state.activeTimer] - 1000
      }))
    }, 1000)
    this.setState({
      [this.state.activeTimer + 'IntervalId']: intervalId
    })
  }

  pause = () => {
    clearInterval(this.state[this.state.activeTimer + 'IntervalId'])
  }

  isActiveTimer = timerName => {
    return this.state.activeTimer == timerName
  }

  takeABreak = () => {
    clearInterval(this.state.activeTimer + 'IntervalId')
    this.setState(prevState => ({
        activeTimer: 'breakTimer',
        breakTimer: prevState.desiredBreakTime
      }))
  }

  backToWork = () => {
    clearInterval(this.state.activeTimer + 'IntervalId')
    this.setState(prevstate=> ({
      activeTimer: 'workTimer',
      workTimer: prevstate.desiredWorkTime
    }))
  }

  humanReadableTime = time => {
    const minutes = Math.floor(time / 1000 / 60)
    const seconds = (time / 1000 % 60).toString().padStart(2, '0')
  
    return `${minutes}:${seconds}`
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.activeTimer === 'workTimer' && (
          <View>
            <Text style={styles.timerTitle}>Work Timer:</Text>
            <Text style={styles.timer}>{this.humanReadableTime(this.state.workTimer)}</Text>
            { this.state.workTimer === 0 && (
              <Button title="Take A Break"
                      onPress={this.takeABreak} /> 
            )}
          </View>
        )}
        { this.state.activeTimer == 'breakTimer' && (
          <View>
            <Text style={styles.timerTitle}>Break Timer:</Text>
            <Text style={styles.timer}>{this.humanReadableTime(this.state.breakTimer)}</Text>
            { this.state.breakTimer === 0 && (
              <Button title="Back To Work"
                      onPress={this.backToWork} /> 
            )}
          </View>
        )}
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
