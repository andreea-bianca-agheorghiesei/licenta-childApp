import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  BackHandler,
  Text,
} from 'react-native';
import {withLocationPermissions} from '../hocs/withLocationPermissions';
import Geolocation from 'react-native-geolocation-service';
//import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import axios from 'axios';
import {BASE_URL} from '../config';
import { useNavigation } from '@react-navigation/native';

const  HomeComponent = (props) =>{

    const [location, setLocation] = useState ({
                                            latitude : null, 
                                            longitude: null
                                        });
    const [observing, setObserving] = useState(false);
    const [position, setPosition] = useState(null);
    const [watchId, setWatchId] = useState(null);
    const navigation = useNavigation();
    const JWTtoken = props.params.JWTtoken;

    useEffect(() => {
       console.log('in main screen..');
       return () => { removeLocationUpdates();}
   }, []);

   useEffect(() => {
     if(observing) {
        console.log(location);
        sendCurrentLocation();
     }
   }, [location])

   useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        if(!JWTtoken){
            return;
        }
        e.preventDefault();
      }),[navigation, JWTtoken]);

  const hasLocationPermission = async () => {
    const {locationPermissionGranted, requestLocationPermission} = props;
    if (!locationPermissionGranted) {
      const granted = await requestLocationPermission();
      if (granted) {
        console.log("on enable: " + granted);
        return granted;
      }
    }
    return locationPermissionGranted;
  };


   const getCurrentLocation =  () => {
   console.log('getting current location... ');
     Geolocation.getCurrentPosition(
      (position) => {
      setLocation({
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
      });
      console.log(location);
      console.log('sending current location...');
      sendCurrentLocation();
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  }

const getLocationUpdates = () => {
    const hasPermission =  hasLocationPermission();

    if(!hasPermission){
      return
    }

  setObserving(true);
  let id = Geolocation.watchPosition(
    (position) => { 
     setLocation({
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
      });
    //   console.log(location);
    //   //console.log('sending current location...');
    //   sendCurrentLocation();
    },
    (error) => {
        setPosition(null);
        console.log(error);
    },
    {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
        forceRequestLocation: true,
        forceLocationManager: true,
        showLocationDialog: true, 
    },
  )
  setWatchId(id);
}

const removeLocationUpdates = () =>{ 
  if(watchId !== null) { 
    Geolocation.clearWatch(watchId);
    setObserving(false);
    setWatchId(null);
  }
}
  
const sendCurrentLocation = () => {
  if(location.latitude !== null && location.longitude !== null) { 
    axios.put(`${BASE_URL}/sendLocation`,
      {
        coordinates: [location.latitude, location.longitude],
      },
      {
        headers: {"x-access-token" : JWTtoken}
      }
    ).then( res => {
        console.log("from server: " + res.data);
    }).catch(err => {
      console.log(err);
    })
  }
}
 
const onCancelLocationPress = () => {
    console.log('removing location updates...');
    removeLocationUpdates();
  };

const onEnableLocationPress =  () => {
    console.log('enable location updates...');   
    getLocationUpdates();
    // getCurrentLocation();
  }



    const {container, button, text} = styles;

    return (
      <View style={container}>
        <TouchableHighlight style={button} onPress={() => onEnableLocationPress()}>
          <Text style={text}>Enable Location</Text>
        </TouchableHighlight>
        <TouchableHighlight style={button} onPress={() => onCancelLocationPress()}>
          <Text style={text}>Cancel Location</Text>
        </TouchableHighlight>
      </View>
    );
  
}

const HomeScreen = withLocationPermissions(HomeComponent);
export default MainScreen;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingHorizontal: 50,
  },
  button: {
    marginVertical: 40,
    backgroundColor: '#2b5082',
    padding: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});
