import React from 'react'
import { Button, StyleSheet, TextInput, Text, Vibration, View } from 'react-native'
import { vibrate } from './utils/index.js'
import Timer from './components/Timer.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showWorkTimer: true,
    }
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.showWorkTimer && (
          <Timer workMode={this.state.showWorkTimer}/>
        ) }
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
})
