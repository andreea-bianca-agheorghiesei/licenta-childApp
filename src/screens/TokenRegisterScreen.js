import React from 'react';
import {
  SafeAreaView, View, Text, TextInput,TouchableOpacity,
  StyleSheet,
  Button
} from 'react-native';

import axios from 'axios';
import {BASE_URL} from '../config';


const styles = StyleSheet.create({ 
    container: {
        alignItems: "center",   
        justifyContent: 'space-around'    
    },
    text: {
        fontSize: 16,
        textAlign:'center',
        width: '85%',
        marginTop:'10%'
        
    },
    text_bold: 
    { 
        fontSize: 25,
        fontWeight: 'bold',
        textAlign:'center',
        width: '80%',
        marginTop: '10%',
        marginBottom: 15
    },
    text_container:
    { 
        alignItems: "center"
    },
    button: {
        width:'50%',
        backgroundColor:'#26c54f',
        borderRadius: 10,
        marginVertical: '20%',
        paddingVertical: 13
    },
    buttonText: {
        fontSize:16,
        fontWeight:'bold',
        color:'#ffffff',
        textAlign:'center'
    },
    textInput: { 
        width: '50%',
        height: '10%',
        marginVertical:'5%',
        borderWidth: 1,
        borderRadius: 10,
        textAlign:'center'   
    }
    
})
const TokenRegisterScreen = ({navigation}) =>
{ 
    const [token, setToken] = React.useState('okXi2v');
    
    const sendToken = () => {
    console.log('token' , token)
    axios.put(`${BASE_URL}/register`,
      {
        token : token
      }
    ).then( res => {
        console.log("from server: " + JSON.stringify(res.data));
        navigation.navigate('Home', {JWTtoken : res.data.JWTtoken})
    }).catch(err => {
      console.log(err);
    });
  }
    
    return (
        <View style={styles.container}>           
            <Text style= {styles.text}> To connect the child's phone with the parent's phone</Text>
            <Text style= {styles.text_bold} >Please introduce the code received in the application on the parent's phone</Text>
            
            <TextInput style={styles.textInput} 
                       placeholder='Cod' 
                       onChangeText={setToken}
                       value = {'okXi2v'}
                       border="#000000"/>
            <TouchableOpacity style={styles.button}  onPress = {()=> sendToken(token)}>
                <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>     
        </View>
    );
} 

export default TokenRegisterScreen;