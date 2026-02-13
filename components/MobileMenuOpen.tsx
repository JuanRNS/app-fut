import { useState } from "react";
import { IconType } from "react-icons";
import { FaChartBar, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function MobileMenuOpen(props: { tabs: { id: string; label: string; icon: IconType }[]; activeTab: string; setActiveTab: (tab: string) => void }) {
    const { tabs, activeTab, setActiveTab } = props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl text-foreground font-bold backdrop-blur-md transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-2">
                    {(() => {
                        const currentTab = tabs.find(t => t.id === activeTab);
                        const Icon = currentTab?.icon || FaChartBar;
                        return (
                            <>
                                <Icon className="text-primary" />
                                <span>{currentTab?.label}</span>
                            </>
                        );
                    })()}
                </div>
                {isMobileMenuOpen ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-secondary" />}
            </button>

            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-3 transition-colors ${isActive
                                    ? "bg-primary/20 text-primary border-l-4 border-primary"
                                    : "text-secondary hover:bg-white/5 hover:text-foreground border-l-4 border-transparent"
                                    }`}
                            >
                                <Icon className={isActive ? "text-primary" : ""} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    )
}