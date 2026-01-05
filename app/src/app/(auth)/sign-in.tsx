import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

const signInSchema = z.object({
    email: z.string({message: 'Email is required'}).email('Invalid Email'),
    password: z.string().min(8)
});

type SignInFields = z.infer<typeof signInSchema>;

export default function SignIn() {
    const { control, handleSubmit, formState: {errors} } = useForm({
        resolver: zodResolver(signInSchema)
    });

    const {signIn} = useAuth();

    const onSignIn = (data: SignInFields) => {
        console.log('Sign In:', data.email, data.password);
        signIn();
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