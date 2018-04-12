import React, { Component } from 'react'
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native'

import startMainTabs from '../MainTabs/startMainTabs'
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput'
import HeadingText from '../../components/UI/HeadingText/HeadingText'
import MainText from '../../components/UI/MainText/MainText'
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground'
import backgroundImage from '../../assets/background.jpg'

class AuthScreen extends Component {
    constructor(props){
        super(props)
        Dimensions.addEventListener('change', this.updateStyles)
    }

    state = {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules: {
                    isEmail: true
                }
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                }
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: 'password'
                }
            }
        }
    }

    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.updateStyles)
    }

    updateStyles = dimension => {
        this.setState({
            viewMode: dimension.window.height > 500 ? 'portrait' : 'landscape'
        })
    }

    loginHandler = () => {
        startMainTabs()
    }

    updateInputState = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value
                    }
                }
            }
        })
    }

    render() {
        let headingText = null
        if(this.state.viewMode === 'portrait'){
            headingText = (
                <MainText>
                    <HeadingText>Please Log In</HeadingText>
                </MainText>
            )
        }
        return (
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <View style={styles.container}>
                    {headingText}
                    <ButtonWithBackground color="#29aaf4" onPress={() => alert('Ты пидор!')}>Switch To Login</ButtonWithBackground>
                    <View style={styles.inputContainer}>
                        <DefaultInput placeholder="Your Email" style={styles.input}
                                      value={this.state.controls.email.value}
                                      onChangeText={(value) => this.updateInputState('email', value)}
                        />
                        <View style={this.state.viewMode === 'portrait' ? styles.portraitPasswordContainer : styles.landscapePasswordContainer}>
                            <View style={this.state.viewMode === 'portrait' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                                <DefaultInput placeholder="Password" style={styles.input}
                                              value={this.state.controls.password.value}
                                              onChangeText={(value) => this.updateInputState('password', value)}
                                />
                            </View>
                            <View style={this.state.viewMode === 'portrait' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                                <DefaultInput placeholder="Confirm Password" style={styles.input}
                                              value={this.state.controls.confirmPassword.value}
                                              onChangeText={(value) => this.updateInputState('confirmPassword', value)}
                                />
                            </View>
                        </View>
                    </View>
                    <ButtonWithBackground color="#29aaf4" onPress={this.loginHandler}>Submit</ButtonWithBackground>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer:{
        width: '80%'
    },
    backgroundImage: {
        width: '100%',
        flex: 1
    },
    input: {
        backgroundColor: '#eee',
        borderColor: '#bbb'
    },
    landscapePasswordWrapper: {
        width: '48%'
    },
    portraitPasswordWrapper: {
        width: '100%'
    },
    landscapePasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portraitPasswordContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }
})

export default AuthScreen