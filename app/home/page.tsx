"use client";

import CreateGroupCard from "@/components/CreateGroupCard";
import GroupCard from "@/components/GroupCard";
import { IResponseGroup } from "../../interface/group.interface";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
    const [groups, setGroups] = useState<IResponseGroup[]>([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch("/api/group", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data: IResponseGroup[] = await response.json();
            setGroups(data);
        } catch (error) {
            toast.error("Erro ao buscar grupos");
        }
    };


    return (
        <div className="mx-auto space-y-8">
            <div className="flex flex-col gap-2 justify-center items-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Bem-vindo
                </h1>
                <p className="text-gray-400">
                    Gerencie seus grupos
                </p>
            </div>

            <div className="flex flex-col gap-6 justify-center items-center">
                <CreateGroupCard fetchGroups={fetchGroups} />
                <div className="w-full flex flex-wrap gap-6 justify-center items-center">
                    {groups.map((group) => (
                        <GroupCard key={group.id} group={group} />
                    ))}
                </div>

            </div>
        </div>
    );
}
