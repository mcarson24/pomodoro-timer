import React from 'react'
import { Button, StyleSheet, Text, Vibration, View } from 'react-native'
import { vibrate } from './utils/index.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workTimer: 300000,
      restTimer: 5000,
      intervalId: ''
    }
  }
  componentDidMount() {
    // setInterval(this.countdown, 1000)
  }
  countdown = () => {
    const intervalId = setInterval(() => {
      if (this.state.workTimer === 0) {
        Vibration.vibrate([500, 500, 500])
        return
      }
      this.setState(prevState => ({
        workTimer: prevState.workTimer - 1000
      }))
    }, 1000)
    this.setState({intervalId})
  }

  pause = () => {
    clearInterval(this.state.intervalId)
  }

  humanReadableTime = time => {
    const minutes = Math.floor(time / 1000 / 60)
    const seconds = (time / 1000 % 60).toString().padStart(2, '0')
  
    return `${minutes}:${seconds}`
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Work Timer:</Text>
        <Text>{this.humanReadableTime(this.state.workTimer)}</Text>
        <Button title="Start" onPress={this.countdown} />
        <Button title="Pause" onPress={this.pause} />
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
});
