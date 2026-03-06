import { ReactNode } from "react";
// import { redirect } from "next/navigation"
import HeaderAuth from "@/components/headerAuth"

interface PrivateLayoutProps {
    children: ReactNode
}

export default async function Layout({ children }: { children: ReactNode }) {


    return (
        <div className="flex flex-col h-screen">
            
            <div className="py-5 bg-blue-600 ">
                <HeaderAuth />
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>

        </div>
    )
}