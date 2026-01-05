import { error } from 'node:console';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, TextInput, TextInputProps,Text } from 'react-native'

type CustomInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({ control, name, ...props }: CustomInputProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { value, onChange, onBlur },
                fieldState: { error }
            }) => (
                <>
                    <TextInput
                        {...props}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        style={[styles.input, props.style]}
                    />
                    {error && <Text style={styles.error}>{error.message}</Text>}
                </>
            )}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: '#ccc'
    },
    error: {
        color: 'red'
    }
})