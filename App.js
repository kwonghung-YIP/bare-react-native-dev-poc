/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
//import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import * as Mqtt from 'react-native-native-mqtt';

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const pako = require('pako')

  //const client = new Mqtt.Client('tcp://test.mosquitto.org:1883')
  //const client = new Mqtt.Client('ws://test.mosquitto.org:8080')
  const client = new Mqtt.Client("wss://mrnzmkh0ufgnb.messaging.solace.cloud:8443")

  client.on(Mqtt.Event.Message,(topic,message) => {
    //console.log(`${topic}:${message.toString()}`);
    const compressed = Uint8Array.from(message.values());
    const raw = pako.inflate(compressed,{to:'string'});
    console.log(`${topic}:${raw}`)
  })

  client.on(Mqtt.Event.Connect,()=>{
    console.log('connect')
    client.subscribe(["public/push/odds/dbl-zip"],[0])
  })

  client.on(Mqtt.Event.Error, (error) => {
    console.log('MQTT Error:', error);
  });

  client.connect({
    clientId: 'react-native-client-1234',
    //username: "rw",
    username: "solace-cloud-client",
    password: "e6r6a8ufj56v9dimfp6tgdectt",    
  },(err) => {
    console.log(`connected:${client.connected}`);
    console.log(`error:${err}`)
    //client.subscribe(["test_topic"],[0])
  })

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
