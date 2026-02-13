import { FaUsers, FaFutbol, FaTrophy, FaChartBar, FaPlus } from "react-icons/fa";

export const TABS = [
    { id: "overview", label: "Visão Geral", icon: FaChartBar },
    { id: "players", label: "Jogadores", icon: FaUsers },
    { id: "matches", label: "Partidas", icon: FaFutbol },
    { id: "ranking", label: "Ranking", icon: FaTrophy },
    { id: "createMatch", label: "Cria Partida", icon: FaPlus },
];