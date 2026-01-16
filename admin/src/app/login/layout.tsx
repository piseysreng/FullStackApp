import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
    children: React.ReactNode;
}

export default async function LoginLayout({ children, }: DashboardLayoutProps) {
    const { userId, sessionClaims } = await auth();

    if (userId) {
        if (sessionClaims?.role === 'admin') {
            redirect('/dashboard');
        } else {
            redirect('/user');
        }

    }



    return (

        <div>
            <Header />
            <div>
                {children}
            </div>
        </div>
    );
}

function Header() {
    return (
        <div><h1>Login Title</h1></div>
    );
}