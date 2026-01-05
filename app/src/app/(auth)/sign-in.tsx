import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'
import SignInWith from '../../components/SignInWith';

const signInSchema = z.object({
    email: z.string({message: 'Email is required'}).email('Invalid Email'),
    password: z.string().min(8)
});

type SignInFields = z.infer<typeof signInSchema>;

export default function SignIn() {
    const { control, handleSubmit,setError ,formState: {errors} } = useForm({
        resolver: zodResolver(signInSchema)
    });
    const { signIn, setActive, isLoaded } = useSignIn();


    const onSignIn = async (data: SignInFields) => {
        if(!isLoaded) return ;
        try {
            const signInAttempt= await signIn.create({
                identifier: data.email,
                password: data.password
            });
            // console.log('Sign In Attempt: ', signInAttempt);
            if (signInAttempt.status === 'complete') {
                setActive({session: signInAttempt.createdSessionId});
            } else {
                console.log('Sign In Failed');
            }
        } catch (error) {
            console.log('Signed Error', error);
            if (isClerkAPIResponseError(error)) {
                setError('email', {message: error.errors[0].longMessage});
                setError('password', {message: error.errors[0].longMessage});
            }
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <CustomInput
                control={control}
                name='email'
                placeholder='Email'
                autoFocus
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
            />
            <CustomInput<SignInFields>
                control={control}
                name='password'
                placeholder='Passoword'
                secureTextEntry
            />
            <CustomButton
                onPress={handleSubmit(onSignIn)}
                text='Sign In'
            />
            <Link href='/sign-up'>
            <Text>Don't have account? Sign Up Now</Text>
            </Link>
            <SignInWith/>
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