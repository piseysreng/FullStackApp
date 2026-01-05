import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo'

const signUpSchema = z.object({
    email: z.string({ message: 'Email is required' }).email('Invalid Email'),
    password: z.string().min(8)
});

type SignUpFields = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const { control, handleSubmit, setError,formState: { errors } } = useForm({
        resolver: zodResolver(signUpSchema)
    });

    const { signUp, isLoaded } = useSignUp();

    const onSignUp = async (data: SignUpFields) => {
        if (!isLoaded) return;
        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({strategy: 'email_code'});
            router.push('/verify');
        } catch (error) {
            console.log('Sign Up Error: ' , error);
            setError('email', {message: error.errors[0].longMessage});
            setError('password', {message: error.errors[0].longMessage});
        }

    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <CustomInput
                control={control}
                name='email'
                placeholder='Email'
                autoFocus
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
            />
            <CustomInput<SignUpFields>
                control={control}
                name='password'
                placeholder='Passoword'
                secureTextEntry
            />
            <CustomButton
                onPress={handleSubmit(onSignUp)}
                text='Sign Up'
            />
            <Link href='/sign-in'>
                <Text>Already have account? Sign In Now</Text>
            </Link>
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