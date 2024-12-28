import { CustomizationInterface } from "../utils/utils";
import { CustomizationPanel } from "./CustomizationPanel";

interface CustomizationWidgetProps {
    widgetKey: string;
    isExpanded: boolean;
    onToggle: (widgetKey: string) => void;
    customizations: CustomizationInterface
}

function CustomizationWidget({
    widgetKey,
    isExpanded,
    onToggle,
    customizations
}: CustomizationWidgetProps) {
    return (
        <div>
            <div
                className={`flex items-center justify-between ${isExpanded ?
                    "bg-blue-500 border-green-400 border-2 border-solid text-white"
                    : "bg-slate-200"
                    } mb-1`}
            >
                <p className="text-base font-medium text-center flex-grow p-1">
                    CUSTOMIZATIONS
                </p>
                <button
                    className="pb-1 h-5 relative right-2 flex items-center justify-center align-middle"
                    onClick={() => onToggle(widgetKey)}
                >
                    {isExpanded ? "▲" : "▼"}
                </button>
            </div>

            {
                isExpanded && (
                    <CustomizationPanel
                    customizations={customizations}
                    handleEdit={null}
                    />
                )
            }
        </div>
    )
}

export default CustomizationWidget;