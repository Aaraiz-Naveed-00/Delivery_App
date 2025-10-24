import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

type ButtonProps = {
    title: string;
    onPress: () => void;
}

const Button = ({title,onPress} : ButtonProps) => {
  return (
    <TouchableOpacity
    style={styles.botton}
    onPress={onPress}>
        <Text style={styles.buttonText} >{title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles=StyleSheet.create({
  botton:{
    backgroundColor:"#0BCE83",
    borderRadius:10,
    alignItems: "center",
    paddingVertical: 12,
    width:"100%",
    marginBottom:10
  },
  buttonText:{
    fontSize: 16, 
    fontWeight:"500",
    color:"white"

  }
})