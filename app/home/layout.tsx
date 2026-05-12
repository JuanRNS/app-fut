"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Sidebar with Desktop support built-in */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex min-h-screen w-full min-w-0 flex-col transition-all duration-500 lg:pl-72">
                <Header isOpen={isSidebarOpen} onOpen={() => setIsSidebarOpen(true)} />

                <main className="relative flex-1 overflow-x-hidden overflow-y-auto bg-noise p-4 md:p-6 xl:overflow-hidden xl:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
