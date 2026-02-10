import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type DashboardLayoutProps = {
    children: React.ReactNode;
}

export default async function DashboardLayout({ children, }: DashboardLayoutProps) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        redirect('/login');
    } else {
        if (sessionClaims?.role !== 'admin') {
            redirect('/user');
        }
    }


    return (
        <div>
            {children}
        </div>
    );
}