import React from 'react'
import Timer from './components/Timer.js'
import { TextInput, StatusBar, StyleSheet, View } from 'react-native'

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
        <StatusBar barStyle="light-content" translucent={true} />
        { this.state.showWorkTimer && (
          <Timer workMode={this.state.showWorkTimer} />
        ) }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
