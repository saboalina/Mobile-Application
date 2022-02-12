import {Spinner, Text, View} from "native-base";
import {Dimensions, StyleSheet} from 'react-native';

export default function Loading(){
    return <View style={styles.container}><Spinner size={"lg"} accessibilityLabel={"Loading..."}></Spinner></View>
}

let styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
