import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { useEffect } from 'react';
import { CURRENT_SCREEN } from '../utility/constants';
import AsyncStorage from '@react-native-community/async-storage';
import { SPLASH_IMAGE } from '../styles/images';
import BackgroundView from '../components/BackgroundView';
import translations from '../utility/translations';
import { DARK_TEXT_COLOR, GRADIENT_COLOR_1, GRADIENT_COLOR_2, WHITE_COLOR } from '../styles/color';
import LinearGradient from 'react-native-linear-gradient';
import databaseAccessor from '../../cm_core/DatabaseAccessor';

const SplashScreen = (props) => {

    const [currentScreen, setCurrentScreen] = useState('CurrencyPage')

    useEffect(() => {
        getLastOpenedScreen();
        createDatabase();
    });

    async function getLastOpenedScreen() {
        let lastOpenedScreen = await AsyncStorage.getItem(CURRENT_SCREEN);
        if (lastOpenedScreen !== null) setCurrentScreen(lastOpenedScreen);
        setTimeout(() => props.navigation.navigate(currentScreen), 3000);
    }

    async function createDatabase() {
        databaseAccessor.createTable();
        databaseAccessor.removeOldValues();
    }

    return (
        <BackgroundView>
            <View style={styles.containerStyle}>
                <LinearGradient colors={[GRADIENT_COLOR_2, GRADIENT_COLOR_1, WHITE_COLOR]} style={styles.linearGradient} />
                <Image
                    style={styles.imageStyle}
                    source={SPLASH_IMAGE}
                    resizeMode='contain'
                >
                </Image>
                <LinearGradient colors={[WHITE_COLOR, GRADIENT_COLOR_1, GRADIENT_COLOR_2]} style={styles.linearGradient}>
                    <View style={styles.textContainerStyle}>
                        <Text style={styles.textStyle}>
                            {translations.created}
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        </BackgroundView>
    )
}


const styles = StyleSheet.create({

    containerStyle: {
        flex: 1,
        justifyContent: 'center',
    },
    imageStyle: {
        flex: 1,
        width: '100%',
    },
    textStyle: {
        color: DARK_TEXT_COLOR,
        fontWeight: 'bold'
    },
    textContainerStyle: {
        alignSelf: 'center',
        marginTop: '19%'
    },
    linearGradient: {
        width: '100%',
        height: '15%',
    },

});

export default SplashScreen;