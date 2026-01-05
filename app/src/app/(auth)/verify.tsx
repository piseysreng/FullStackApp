import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo'

const verifySchema = z.object({
    code: z.string({ message: 'Code is required' }).length(6, 'invalid code')
});

type VerifyFields = z.infer<typeof verifySchema>;

export default function VerifyScreen() {
    const { control, handleSubmit, setError,formState: { errors } } = useForm({
        resolver: zodResolver(verifySchema)
    });

    const { signUp, isLoaded, setActive } = useSignUp();

    const onVerify = async (data: VerifyFields) => {
        if(!isLoaded) return ;
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({code: data.code});
            if (signUpAttempt.status === 'complete') {
                setActive({session: signUpAttempt.createdSessionId});
            } else {
                console.log(signUpAttempt);
            }
        } catch (error) {
            console.log('Error Verify', error);
            setError('code', {message: error.errors[0].longMessage});
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text style={styles.title}>Verify Your Email</Text>
            <CustomInput
                control={control}
                name='code'
                placeholder='123456'
                autoFocus
                autoCapitalize='none'
            />
            <CustomButton
                onPress={handleSubmit(onVerify)}
                text='Verify Now'
            />
            <StatusBar style='auto' />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        gap: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '600'
    },
})