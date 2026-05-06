"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CgClose } from "react-icons/cg";
import { FaOutdent } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { logout } from "@/lib/logout";
import { SidebarProps } from "@/interface/sidebar.interface";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return (
        <>
            <div
                className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-300 bg-[var(--header-background)] border-r border-border ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
                    <div className="flex items-center justify-between mb-10 pl-2.5">
                        <Link href="/home" className="flex items-center w-full justify-between" onClick={onClose}>
                            <span className="self-center whitespace-nowrap text-xl font-semibold text-[var(--header-foreground)] font-mono tracking-tighter">
                                FUT APP
                            </span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 text-[var(--header-foreground)]/60 hover:text-[var(--header-foreground)] rounded-lg hover:bg-white/10"
                        >
                            <CgClose />
                        </button>
                    </div>

                    <ul className="space-y-2 font-medium">
                        <li className="pl-2.5">
                            <Link
                                href="/home"
                                onClick={onClose}
                                className={`group flex items-center rounded-lg p-2 transition-all duration-200 ${isActive("/home")
                                    ? "bg-primary/10 text-primary shadow-md shadow-primary/10 border border-primary/20"
                                    : "text-[var(--header-foreground)]/60 hover:bg-white/10 hover:text-[var(--header-foreground)]"
                                    }`}
                            >
                                <FaHouse />
                                <span className="ms-3">Home</span>
                            </Link>
                        </li>
                        <li className="pl-2.5">
                            <Link
                                onClick={logout}
                                href="/login"
                                className={`group flex items-center rounded-lg p-2 transition-all duration-200 ${isActive("/login")
                                    ? "bg-primary/10 text-primary shadow-md shadow-primary/10 border border-primary/20"
                                    : "text-[var(--header-foreground)]/60 hover:bg-white/10 hover:text-[var(--header-foreground)]"
                                    }`}
                            >
                                <FaOutdent />
                                <span className="ms-3">Logout</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}
