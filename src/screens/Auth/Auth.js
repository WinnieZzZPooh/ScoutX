import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Video from 'react-native-video'

import MaterialInput from '../../components/UI/MaterialInput/MaterialInput'
import HeadingText from '../../components/UI/HeadingText/HeadingText'
import MainText from '../../components/UI/MainText/MainText'
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground'
import validate from '../../utility/validation'
import { tryAuth, authAutoSignIn } from '../../store/actions/auth'

import bgVideo from '../../assets/bg-video.mp4'

class AuthScreen extends Component {
    constructor(props){
        super(props)
        Dimensions.addEventListener('change', this.updateStyles)
    }

    state = {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
        authMode: 'login',
        controls: {
            email: {
                value: '',
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false,
                error: null
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false,
                error: null
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    equalTo: 'password'
                },
                touched: false,
                error: null
            }
        }
    }

    static navigatorStyle = {
        navBarHidden: true
    };

    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.updateStyles)
    }

    componentDidMount(){
        this.props.onAutoSignIn()
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login' ? 'signup' : 'login'
            }
        })
    }

    updateStyles = dimension => {
        this.setState({
            viewMode: dimension.window.height > 500 ? 'portrait' : 'landscape'
        })
    }

    authHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        this.props.onTryAuth(authData, this.state.authMode)
    }

    updateInputState = (key, value) => {
        let connectedValue = {}
        if(this.state.controls[key].validationRules.equalTo){
            const equalControl = this.state.controls[key].validationRules.equalTo
            const equalValue = this.state.controls[equalControl].value
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            }
        }
        if(key === 'password'){
            connectedValue = {
                ...connectedValue,
                equalTo: value
            }
        }

        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid: key === 'password'
                            ? validate(prevState.controls.confirmPassword.value, prevState.controls.confirmPassword.validationRules, connectedValue)
                            : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, prevState.controls[key].validationRules, connectedValue),
                        touched: true
                    }
                }
            }
        })
    }

    checkError = (key, errorText) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        error: prevState.controls[key].valid ? '' : errorText
                    }
                }
            }
        })
    }

    render() {
        let headingText = null
        let confirmPasswordControl = null
        let submitButton = (
            <ButtonWithBackground color="#e91e63"
                                  onPress={this.authHandler}
                                  disabled={
                                      !this.state.controls.confirmPassword.valid && this.state.authMode === 'signup' ||
                                      !this.state.controls.email.valid ||
                                      !this.state.controls.password.valid
                                  }>
                Войти
            </ButtonWithBackground>
        )

        if(this.state.viewMode === 'portrait'){
            headingText = (
                <MainText>
                    <HeadingText>{this.state.authMode === 'login' ? 'Авторизация...' : 'Регистрация'}</HeadingText>
                </MainText>
            )
        }
        if (this.state.authMode === 'signup') {
            confirmPasswordControl = (
                <View
                    style={this.state.viewMode === 'portrait' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                    <MaterialInput label="Нука повтори..."
                                   value={this.state.controls.confirmPassword.value}
                                   onChangeText={(value) => this.updateInputState('confirmPassword', value)}
                                   onBlur={() => this.checkError('confirmPassword', 'Пароль повтори')}
                                   valid={this.state.controls.confirmPassword.valid}
                                   error={this.state.controls.confirmPassword.error}
                                   touched={this.state.controls.confirmPassword.touched}
                                   secureTextEntry
                    />
                </View>
            )
        }
        if(this.props.isLoading){
            submitButton = <ActivityIndicator />
        }
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <Video repeat source={{uri:'background'}} resizeMode="cover" style={StyleSheet.absoluteFill}/>
                {headingText}
                <ButtonWithBackground color="#e91e63"
                                      onPress={this.switchAuthModeHandler}
                >
                    К {this.state.authMode === 'login' ? 'регистрации' : 'авторизации'}
                </ButtonWithBackground>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inputContainer}>
                        <MaterialInput label="Твой ящик" style={styles.input}
                                       value={this.state.controls.email.value}
                                       onChangeText={(value) => this.updateInputState('email', value)}
                                       onBlur={() => this.checkError('email', 'Неверный ящик')}
                                       valid={this.state.controls.email.valid}
                                       error={this.state.controls.email.error}
                                       touched={this.state.controls.email.touched}
                                       autoCapitalize="none" autoCorrect={false} keyboardType="email-address"
                        />
                        <View style={this.state.viewMode === 'portrait' || this.state.authMode === 'login'
                            ? styles.portraitPasswordContainer
                            : styles.landscapePasswordContainer
                        }>
                            <View style={this.state.viewMode === 'portrait' || this.state.authMode === 'login'
                                ? styles.portraitPasswordWrapper
                                : styles.landscapePasswordWrapper
                            }>
                                <MaterialInput label="Пароль"
                                               value={this.state.controls.password.value}
                                               onChangeText={(value) => this.updateInputState('password', value)}
                                               onBlur={() => this.checkError('password', 'Слишком короткий, как твой, наверное...')}
                                               valid={this.state.controls.password.valid}
                                               error={this.state.controls.password.error}
                                               touched={this.state.controls.password.touched}
                                               secureTextEntry
                                />
                            </View>
                            {confirmPasswordControl}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {submitButton}
            </KeyboardAvoidingView>
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
        color: '#e91e63'
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

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
        onAutoSignIn: () => dispatch(authAutoSignIn())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)