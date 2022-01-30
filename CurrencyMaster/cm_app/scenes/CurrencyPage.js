import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Button } from 'react-native';
import { CURRENCY_TYPE, CURRENT_SCREEN } from '../utility/constants';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundView from '../components/BackgroundView';
import { useFocusEffect } from '@react-navigation/native';
import HeaderView from '../components/HeaderView';
import { RATES_IMAGE, ARROW_IMAGE } from '../styles/images';
import {
    BORDER_COLOR,
    DARK_TEXT_COLOR,
    CURRENCY_BACKGROUND_COLOR,
    VALUE_BACKGROUND_COLOR,
    GRADIENT_COLOR_1
} from '../styles/color';
import cmServerHelper from '../../cm_core/CMServerHelper';
import translations from '../utility/translations';

const DATA = [
    {
        from: CURRENCY_TYPE.USD,
        to: CURRENCY_TYPE.EUR,
        usdValue: '1',
        anotherValue: ''
    },
    {
        from: CURRENCY_TYPE.USD,
        to: CURRENCY_TYPE.RUB,
        usdValue: '1',
        anotherValue: ''
    }
];

const DISPATCH_ACTION_TYPE = {
    INIT: 'init'
};

function reducer(state, action) {
    switch (action.type) {
        case DISPATCH_ACTION_TYPE.INIT:
            const items = action.payload;
            return items;
        default:
            return state;
    }
}

const FILE_NAME = 'CurrencyPage:';

const CurrencyPage = (props) => {

    const [currencyData, dispatch] = useReducer(reducer, []);

    useEffect(() => {
        console.log(FILE_NAME, ' useEffect called')
        getCurrentRates();
    });

    useFocusEffect(
        useCallback(() => {
            console.log(FILE_NAME, ' useFocusEffect called')
            setCurrentScreen();
            return () => { };
        }, []),
    );

    async function getCurrentRates() {
        let response = await cmServerHelper.fetchCurrencies()
        if (response.data !== undefined) {
            DATA[0].anotherValue = response.data.EUR.toFixed(2)
            DATA[1].anotherValue = response.data.RUB.toFixed(2)
            dispatch({ type: DISPATCH_ACTION_TYPE.INIT, payload: DATA });
        }
    }

    async function setCurrentScreen() {
        await AsyncStorage.setItem(CURRENT_SCREEN, 'CurrencyPage')
    }


    function getItem(item) {
        return (
            <View>
                <View style={styles.headerStyle}>
                    <View style={styles.currencyViewStyleLeft}>
                        <Text style={styles.currencyTextStyle}>
                            {item.from}
                        </Text>
                    </View>
                    <View style={styles.currencyViewStyleRigth}>
                        <Text style={styles.currencyTextStyle}>
                            {item.to}
                        </Text>
                    </View>
                </View>
                <View style={styles.valueStyle}>
                    <View style={styles.valueViewStyleLeft}>
                        <Text style={styles.currencyTextStyle}>
                            {item.usdValue}
                        </Text>
                    </View>
                    <View style={styles.valueViewStyleRigth}>
                        <Text style={styles.currencyTextStyle}>
                            {item.anotherValue}
                        </Text>
                    </View>
                </View>
                <View style={styles.historyContainerStyle}>
                    <TouchableOpacity
                        style={styles.historyViewStyle}
                        onPress={() => props.navigation.navigate('CurrencyDetails', {
                            currency: item.to,
                            lastValue: item.anotherValue
                        })}>
                        <Text style={styles.historyTextStyle}>
                            {translations.watch_history}
                        </Text>
                        <Image source={ARROW_IMAGE} style={styles.arrowImageStyle}>
                        </Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <BackgroundView>
            <View style={styles.containerStyle}>
                <HeaderView
                    headerText={translations.exchange_rates}
                    src={RATES_IMAGE}
                    showBackBtn={false}>
                </HeaderView>
                {currencyData.length !== 0 ?
                    <FlatList
                        style={styles.listStyle}
                        data={currencyData}
                        renderItem={({ item, index }) => getItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    : null
                }
                {currencyData.length === 0 ?
                    <View style={styles.noDataContainerStyle}>
                        <Text style={styles.noDataTextStyle}>
                            {translations.no_data_available}
                        </Text>
                        <Button
                            title={translations.retry_btn}
                            color={GRADIENT_COLOR_1}
                            onPress={() => { getCurrentRates() }}>
                        </Button>
                    </View>
                    : null
                }
            </View>
        </BackgroundView>
    )
}

const styles = StyleSheet.create({

    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    listStyle: {
        marginTop: '20%',
        marginHorizontal: "5%"
    },
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: CURRENCY_BACKGROUND_COLOR,
        height: 50
    },
    valueStyle: {
        flexDirection: 'row',
        backgroundColor: VALUE_BACKGROUND_COLOR,
        height: 50,
    },
    currencyViewStyleLeft: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        borderColor: DARK_TEXT_COLOR,
        borderWidth: 1
    },
    currencyViewStyleRigth: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        borderColor: DARK_TEXT_COLOR,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    valueViewStyleLeft: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        borderColor: BORDER_COLOR,
        borderWidth: 1
    },
    valueViewStyleRigth: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        borderColor: BORDER_COLOR,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    currencyTextStyle: {
        fontSize: 16,
        color: DARK_TEXT_COLOR
    },
    historyContainerStyle: {
        height: 80,
        alignItems: 'center',
    },
    historyTextStyle: {
        fontSize: 14,
        color: DARK_TEXT_COLOR
    },
    historyViewStyle: {
        flexDirection: 'row',
        padding: '5%'
    },
    arrowImageStyle: {
        height: 24,
        width: 24,
        marginLeft: '3%'
    },
    noDataTextStyle: {
        fontSize: 14,
        color: DARK_TEXT_COLOR,
        marginBottom: 15
    },
    noDataContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

});

export default CurrencyPage;