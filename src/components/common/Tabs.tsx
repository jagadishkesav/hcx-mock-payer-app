export default function Tabs(props: {
  tabs: {
    id: string;
    name: string;
    children: React.ReactNode;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { tabs, activeTab, setActiveTab } = props;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 py-2 border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 relative rounded hover:bg-gray-200 hover:text-blue-600 transition ${activeTab === tab.id ? "text-blue-600" : "text-gray-500"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <p className="">{tab.name}</p>
            <div
              className={`absolute -bottom-2 left-0 transition ${activeTab === tab.id ? "h-[2px]" : "h-0"
                } w-full bg-blue-600`}
            />
          </button>
        ))}
      </div>
      <div className="rounded-xl mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.children}
      </div>
    </div>
  );
}
