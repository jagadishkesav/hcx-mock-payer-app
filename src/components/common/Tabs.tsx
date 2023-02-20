export default function Tabs(props: {
    tabs: {
        id: string,
        name: string,
        children: React.ReactNode
    }[],
    activeTab: string,
    setActiveTab: (tab: string) => void
}) {
    const { tabs, activeTab, setActiveTab } = props;

    return (
        <div className="flex-1">
            <div className="flex items-center gap-2 py-2 border-b border-gray-300">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 relative rounded hover:bg-gray-200 hover:text-black transition ${activeTab === tab.id ? "text-black" : "text-gray-500"}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.name}
                        <div className={`absolute -bottom-2 left-0 transition ${activeTab === tab.id ? "h-[2px]" : "h-0"} w-full bg-black`} />
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-xl mt-4">
                {tabs.find(tab => tab.id === activeTab)?.children}
            </div>
        </div>
    )
}