import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function UserLayout() {

    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/login');
    } else {
        if (sessionClaims?.role === 'admin') {
            redirect('/dashboard');
        }
    }



    return (
        <div>
            UserLayout
            <SignOutButton/>
        </div>
        
    )
}
