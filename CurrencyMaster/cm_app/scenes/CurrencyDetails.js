import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ALERT_TYPE, CHOSEN_CURRENCY, CURRENT_SCREEN, LAST_VALUE, } from '../utility/constants';
import BackgroundView from '../components/BackgroundView';
import { useFocusEffect } from '@react-navigation/native';
import HeaderView from '../components/HeaderView';
import { HISTORY_IMAGE } from '../styles/images';
import translations from '../utility/translations';
import { BORDER_COLOR, CURRENCY_BACKGROUND_COLOR, DARK_TEXT_COLOR, GRADIENT_COLOR_1, VALUE_BACKGROUND_COLOR } from '../styles/color';
import { TextInput } from 'react-native-gesture-handler';
import databaseAccessor from '../../cm_core/DatabaseAccessor';

const FILE_NAME = 'CurrencyDetails:';

const CurrencyDetails = (props) => {
    let value = props.route.params === undefined ? '' : props.route.params.lastValue;

    const [number, setNumber] = useState('');
    const [data, setData] = useState([]);
    const [currencyType, setCurrencyType] = useState(props.route.params === undefined ? '' : props.route.params.currency);

    useEffect(() => {
        console.log(FILE_NAME, ' useEffect called')
    });

    useFocusEffect(
        useCallback(() => {
            console.log(FILE_NAME, ' useFocusEffect called')
            setNumber(value)
            setCurrentScreen();
            fetchCurrencies();
            return () => { };
        }, []),
    );

    async function fetchCurrencies() {
        let lastCurrency;
        if (currencyType == '') {
            lastCurrency = await AsyncStorage.getItem(CHOSEN_CURRENCY);
            setCurrencyType(lastCurrency)
            let lastValue = await AsyncStorage.getItem(LAST_VALUE);
            setNumber(lastValue)
        }

        let dataFromDB = [];
        let allValuesByTypeFromDB = await databaseAccessor.fetchCurrenciesByTypeFromDB(currencyType == '' ? lastCurrency : currencyType);
        allValuesByTypeFromDB.forEach((item) => {
            dataFromDB.push({ id: item.id, date: item.timestamp, currencyType: item.currency_type, value: item.value })
        })
        dataFromDB.sort((a, b) => b.id - a.id)
        setData(dataFromDB)
    }

    async function addValueToDB() {
        if (number != '' && number > 0) {
            let object = { currency_type: currencyType, timestamp: new Date(Date.now()).toLocaleDateString(), value: number };
            await databaseAccessor.insertValueToDB(object);
            fetchCurrencies();
            setNumber('');
        } else {
            showAlert();
        }
    }

    function showAlert() {
        Alert.alert(
            ALERT_TYPE.WARNING,
            translations.please_enter_value,
            [
                {
                    text: translations.ok,
                },
            ],
            {
                cancelable: false,
            }
        )
    }

    async function setCurrentScreen() {
        await AsyncStorage.setItem(CURRENT_SCREEN, 'CurrencyDetails')
        if (props.route.params != undefined) {
            await AsyncStorage.setItem(CHOSEN_CURRENCY, props.route.params.currency)
            await AsyncStorage.setItem(LAST_VALUE, props.route.params.lastValue)
        }
    }

    function getItem(item) {
        return (
            <View>
                <View style={styles.valueStyle}>
                    <View style={styles.valueViewStyleLeft}>
                        <Text style={styles.currencyTextStyle}>
                            {item.value}
                        </Text>
                    </View>
                    <View style={styles.valueViewStyleRigth}>
                        <Text style={styles.currencyTextStyle}>
                            {item.date}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <BackgroundView>
            <View style={styles.containerStyle}>
                <HeaderView
                    headerText={translations.rate_history}
                    src={HISTORY_IMAGE}
                    showBackBtn={true}
                    onBackPress={() => props.navigation.navigate('CurrencyPage')}>
                </HeaderView>
                <View style={styles.inputContainerStyle}>
                    <TextInput
                        style={styles.textInputStyle}
                        keyboardType="numeric"
                        placeholder={number}
                        value={number}
                        onChangeText={(text) => {
                            setNumber(text);
                        }}
                        maxLength={15}
                    >
                    </TextInput>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            title={translations.add}
                            color={GRADIENT_COLOR_1}
                            onPress={() => { addValueToDB(); }}>
                        </Button>
                    </View>
                </View>
                <View style={styles.dataContainerStyle}>
                    {data.length !== 0 ?
                        <View>
                            <View style={styles.headerStyle}>
                                <View style={styles.currencyViewStyleLeft}>
                                    <Text style={styles.currencyTextStyle}>
                                        {currencyType}
                                    </Text>
                                </View>
                                <View style={styles.currencyViewStyleRigth}>
                                    <Text style={styles.currencyTextStyle}>
                                        {translations.date}
                                    </Text>
                                </View>
                            </View>
                            <FlatList
                                style={styles.listStyle}
                                data={data}
                                renderItem={({ item, index }) => getItem(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        : null
                    }
                    {data.length === 0 ?
                        <View style={styles.noDataContainerStyle}>
                            <Text style={styles.noDataTextStyle}>
                                {translations.no_data_saved}
                            </Text>
                        </View>
                        : null
                    }
                </View>
            </View>
        </BackgroundView>
    )
}

const styles = StyleSheet.create({

    containerStyle: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    inputContainerStyle: {
        marginHorizontal: '5%',
        marginTop: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '6%',
        alignItems: 'center'
    },
    inputTextStyle: {
        fontSize: 16,
        color: DARK_TEXT_COLOR
    },
    textInputStyle: {
        width: '80%',
        height: '90%',
        backgroundColor: VALUE_BACKGROUND_COLOR,
        borderRadius: 4
    },
    buttonContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    dataContainerStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        marginHorizontal: '5%',
        marginTop: '5%',
    },
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: CURRENCY_BACKGROUND_COLOR,
        height: 50
    },
    currencyViewStyleLeft: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        borderColor: DARK_TEXT_COLOR,
        borderWidth: 1,
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
    currencyTextStyle: {
        fontSize: 16,
        color: DARK_TEXT_COLOR
    },
    valueStyle: {
        flexDirection: 'row',
        backgroundColor: VALUE_BACKGROUND_COLOR,
        height: 50,
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
    listStyle: {
        marginBottom: '20%',
    },

});

export default CurrencyDetails;