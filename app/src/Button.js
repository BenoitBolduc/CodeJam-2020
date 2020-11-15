import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

function Button({ text, onClick }) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.actionButton}>
        <Text style={styles.actionButtonText}>{text}</Text>
        <Ionicons
          name="md-arrow-forward"
          size={32}
          color="rgba(0, 0, 0, 0.7)"
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: 'white',
    textAlign: 'center',
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 2,
  },
  actionButtonText: {
    fontFamily: 'A little sunshine',
    fontSize: 32,
  },
})

export default Button
