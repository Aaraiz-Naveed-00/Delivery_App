import {Animated, StyleSheet, View, Text } from 'react-native'
import React, { useRef, useEffect } from 'react'

const SplashScreen = () => {
  const progress =  useRef(new Animated.Value(0)).current;


  useEffect(()=>{
    Animated.timing(progress, {toValue:1,useNativeDriver:true}).start();
  },[]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.square, {opacity: progress}]}/>
    </View>
  )
}

export default SplashScreen 


const styles= StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    alignItems:"center",
    justifyContent:"center"
  },
  square:{
    width:100,
    height:100,
    backgroundColor:'rgba(0,0,256,0.5)',
  }
})