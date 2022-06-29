import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/kamono_logo.jpg')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 220,
    marginBottom: 8,
    alignSelf: 'center'
  },
})
