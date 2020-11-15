import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native'

import { useFonts } from 'expo-font'
import { useAssets } from 'expo-asset'
import { Audio } from 'expo-av'

import Button from './src/Button.js'
import { fetchType } from './src/api-access.js'

function Message({ message, fadeAnim, assets }) {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      <ImageBackground source={assets[2]} style={styles.textBubble}>
        <Text style={styles.text} adjustsFontSizeToFit>
          {message}
        </Text>
      </ImageBackground>
    </Animated.View>
  )
}

const ERROR = "I'm sorry, an error occurred."

export default function App() {
  const [message, setMessage] = useState('')
  const [fontsLoaded] = useFonts({
    'A little sunshine': require('./assets/fonts/sunshine.ttf'),
  })
  const [assets] = useAssets([
    require('./assets/images/babushdoggo.png'),
    require('./assets/images/background.png'),
    require('./assets/images/bubble.png'),
    require('./assets/audio/miaow.mp3'),
    require('./assets/audio/woof.mp3'),
  ])
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [type, setType] = useState('compliment')
  const soundObject = useRef(new Audio.Sound())

  useEffect(() => {
    Audio.setIsEnabledAsync(true)
      .then(() => {
        soundObject.current.loadAsync(require('./assets/audio/woof.mp3'))
      })
      .catch((err) => console.log(err))

    return () => {
      soundObject.current.unloadAsync()
    }
  }, [soundObject])

  const fetchNewType = useCallback(
    async (type) => {
      const result = await fetchType(type)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start()

      try {
        await soundObject.current.setPositionAsync(0)
        await soundObject.current.playAsync()
      } catch (error) {
        console.log(error)
      }
      setTimeout(async () => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()

        const newMessage = result
          .map((x) => (type === 'joke' ? x.question : x))
          .leftOr(ERROR)

        setMessage(newMessage)
      }, 800)

      return result
    },
    [fadeAnim, soundObject, setMessage]
  )

  useEffect(() => {
    let timeoutId = null
    if (type === 'joke') {
      fetchNewType(type).then((data) => {
        timeoutId = setTimeout(() => {
          const newMessage = data.map((x) => x.punchline).leftOr(ERROR)
          setMessage(newMessage)

          timeoutId = setTimeout(() => {
            setType('compliment')
          }, 5000)
        }, 5000)
      })
      return
    } else if (type !== 'compliment') {
      fetchNewType(type).then((data) => {
        timeoutId = setTimeout(() => {
          setType('compliment')
        }, 5000)
      })
      return
    }

    const id = setInterval(() => fetchNewType('compliment'), 20000)

    return () => {
      clearInterval(id)
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [fetchNewType, setType, type, setMessage])

  const onCheer = useCallback(() => setType('joke'), [setType])
  const onBored = useCallback(() => setType('activity'), [setType])

  const loading = !fontsLoaded || !assets

  return (
    <View style={styles.container}>
      {!loading && (
        <>
          <Image
            style={{
              position: 'absolute',
              zIndex: 0,
              flex: 1,
              resizeMode: 'contain',
              transform: [{ rotateY: '180deg' }],
            }}
            blurRadius={1}
            source={assets[1]}
          />
          <SafeAreaView style={styles.wrapper}>
            <Image source={assets[0]} style={styles.babushka} />
            <Message
              type={type}
              message={message}
              fadeAnim={fadeAnim}
              assets={assets}
            />
            <View>
              <Button onClick={onCheer} text="Cheer me up!" />
              <Button onClick={onBored} text="What should I do?" />
            </View>
          </SafeAreaView>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  text: {
    fontSize: 36,
    width: 260,
    height: 150,
    transform: [{ translateY: 98 }, { rotateZ: '10deg' }, { translateX: 80 }],
    fontFamily: 'A little sunshine',
  },
  textBubble: {
    top: -16,
    resizeMode: 'cover',
    width: 400,
    height: 400,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    position: 'relative',
  },
  babushka: {
    height: 700,
    width: 700,
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
    transform: [{ translateX: -60 }],
  },
})
