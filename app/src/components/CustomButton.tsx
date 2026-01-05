import { Pressable, PressableProps, StyleSheet, Text } from 'react-native'
import Colors from '../components/colorCode';

type CustomButtonProps = {
    //
    text: string;
} & PressableProps;

export default function CustomButton({ text, ...pressableProps }: CustomButtonProps) {
    return (
        <Pressable
            {...pressableProps}
            style={styles.button}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.background,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: Colors.textWhite,
        fontSize: 16,
        fontWeight: '600'
    },
})