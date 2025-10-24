import { TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

type BackButtonProps = {
    onPress: () => void;
}

const BackButton = ({onPress} : BackButtonProps) => {
  return (
    <TouchableOpacity
        style={styles.backButton}
        onPress={onPress}>
           <Ionicons name="chevron-back" size={28} color="#3c3066" />
        </TouchableOpacity>
  )
}

export default BackButton

const styles=StyleSheet.create({
    backButton: {
        marginLeft:10,
        marginTop:40
    }
})