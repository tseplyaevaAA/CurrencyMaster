import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WHITE_COLOR } from '../styles/color';

const BackgroundView = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({

    containerStyle: {
        flex: 1,
        backgroundColor: WHITE_COLOR
    },

});

export default BackgroundView;