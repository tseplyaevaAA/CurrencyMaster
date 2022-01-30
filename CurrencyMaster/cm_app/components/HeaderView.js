import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { GRADIENT_COLOR_1, DARK_TEXT_COLOR } from '../styles/color';
import { BACK_ARROW } from '../styles/images';

const HeaderView = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.showBackBtn &&
                <TouchableOpacity style={styles.imageContainerStyle} onPress={props.onBackPress}>
                    <Image style={styles.backImageStyle} source={BACK_ARROW} resizeMode='contain'>
                    </Image>
                </TouchableOpacity>
            }
            {!props.showBackBtn &&
                <Image style={styles.imageStyle} source={props.src} resizeMode='contain'>
                </Image>
            }
            <Text style={styles.textStyle}>
                {props.headerText}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

    containerStyle: {
        justifyContent: 'flex-start',
        height: '8%',
        backgroundColor: GRADIENT_COLOR_1,
        paddingHorizontal: '5%',
        flexDirection: 'row',
    },
    textStyle: {
        fontWeight: 'bold',
        color: DARK_TEXT_COLOR,
        fontSize: 20,
        alignSelf: 'center',
        marginLeft: '5%'
    },
    imageStyle: {
        height: '70%',
        width: '15%',
        alignSelf: 'center'
    },
    imageContainerStyle: {
        height: '70%',
        width: '15%',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    backImageStyle: {
        height: '80%',
        width: '80%',
        alignSelf: 'center'
    },

});

export default HeaderView;