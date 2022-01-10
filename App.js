import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

//added configs in app.json

Notifications.setNotificationHandler({
  handleNotification: async () => { //this executes before notifications comes on screen and tells what to do with that notification with the operating system
    return {
      shouldShowAlert: true, //now it will show the notification when app is in foreground
      shouldPlaySound : true
    }
  }
})

export default function App() {

  useEffect(() => {
    //For IOS
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj; //if we dont pass then we wont get this data below
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") { 
          return;
        }
      }); 

  }, [])

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      //This allows to run function when user interacted or when pressed notification while app is in background
      console.log(response);
    }) 
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      //allows us to run function when notification received while app is running
      console.log(notification)
    }) 

    return () => {
      foregroundSubscription.remove()
      backgroundSubscription.remove()
    }
  }, [])

  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({ //This is the local notification process
      content: {
        title: 'My first local notification',
        body: " This is my first local notification we are sending",
      },
      trigger: { //when should notification trigger
        seconds : 10, 
      }
    })
  }

  return (
    <View style={styles.container}>
      <Button title='Trigger Notification' onPress={triggerNotificationHandler}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
