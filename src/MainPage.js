import React, {Component, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
} from 'react-native';
import {withLocationPermissions} from './hocs/withLocationPermissions';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/child'
class MainPageClass extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      latitude: null, 
      longitude : null, 
      timestamp: null,  
      observing: false,
      position : null,
      watchId : null
    }

  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.removeLocationUpdates();  
  }


  hasLocationPermission = async () => {
    const {locationPermissionGranted, requestLocationPermission} = this.props;
    if (!locationPermissionGranted) {
      const granted = await requestLocationPermission();
      if (granted) {
        console.log("on enable: " + granted);
        return granted;
      }
    }
    return locationPermissionGranted;
  };


getCurrentLocation =  () => {
   console.log('getting current location... ');
     Geolocation.getCurrentPosition(
      (position) => {
        this.setState(
        {
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
        }
      );
      console.log(this.state);
      console.log('sending current location...');
      this.sendCurrentLocation();
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  }

getLocationUpdates = () => {
    const hasPermission =  this.hasLocationPermission();

    if(!hasPermission){
      return
    }

  this.setState({observing: true,
   watchId: Geolocation.watchPosition(
    (position) => { 
     this.setState(
        {
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
        }
      );
      console.log(this.state.latitude + " " + this.state.longitude);
      //console.log('sending current location...');
      this.sendCurrentLocation();
    },
    (error) => {
            this.setState(
        {
          position: null
        }
      );
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
        useSignificantChanges: true, //IOS only 
    },
  )
  });

}

removeLocationUpdates = () =>{ 
  if(this.state.watchId !== null) { 
    Geolocation.clearWatch(this.state.watchId);
    this.setState({
      observing: false,
      watchId: null
    })
  }
}
  
sendCurrentLocation = () => {
  if(this.state.latitude !== null && this.state.longitude !== null) { 
    console.log('in send');
    axios.put(`${API_URL}/sendLocation`,
      {
        coordinates: [this.state.latitude, this.state.longitude],
        token : 'RTWX'
      }
    ).then( res => {
        console.log("from server: " + res.data);
    }).catch(err => {
      console.log(err);
    })
  }
}
  onCancelLocationPress = () => {
    console.log('removing location updates...');
    this.removeLocationUpdates();
  };

  onEnableLocationPress =  () => {
    console.log('enable location updates...');   
    this.getLocationUpdates();
    // this.getCurrentLocation();
  }


  render() {
    const {container, button, text} = styles;

    return (
      <View style={container}>
        <TouchableHighlight style={button} onPress={this.onEnableLocationPress}>
          <Text style={text}>Enable Location</Text>
        </TouchableHighlight>
        <TouchableHighlight style={button} onPress={this.onCancelLocationPress}>
          <Text style={text}>Cancel Location</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export const MainPage = withLocationPermissions(MainPageClass);

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
