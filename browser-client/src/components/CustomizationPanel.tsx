import { CustomizationInterface, CustomizationLabels, Mode } from "../utils/utils";
import { CustomizationItem } from "./CustomizationItem";

interface CustomizationPanelProps {
    customizations: CustomizationInterface;
    handleEdit: ((dataKey: string | null) => void) | null;
}

/*
turn this into CustomizationPanel
create new CustomizationWidget or even re-name to DropDown
*/

export function CustomizationPanel({customizations, handleEdit} : CustomizationPanelProps) {
    return (
        <div>
            <div>
                <CustomizationItem
                    label={CustomizationLabels.StartArticle}
                    value={customizations.start.title}
                    dataKey={CustomizationLabels.StartArticle}
                    onEdit={handleEdit}
                />

                <CustomizationItem
                    label={CustomizationLabels.EndArticle}
                    value={customizations.end.title}
                    dataKey={CustomizationLabels.EndArticle}
                    onEdit={handleEdit}
                />

                <CustomizationItem
                    label={CustomizationLabels.Tracking}
                    value={customizations.track[0]}
                    dataKey={CustomizationLabels.Tracking}
                    onEdit={handleEdit}
                />

                <CustomizationItem
                    label={CustomizationLabels.Restrictions}
                    value={customizations.restrictions.join(" · ")}
                    dataKey={CustomizationLabels.Restrictions}
                    onEdit={handleEdit}
                />
            </div>

            {
                handleEdit != null && (
                    <p className="text-center font-bold text-base bg-sky-200">Mode</p>
                )
            }

            <CustomizationItem
                label={CustomizationLabels.Type}
                value={customizations.mode.type}
                dataKey={CustomizationLabels.Type}
                onEdit={handleEdit}
            />

            <div className="group relative">

                {customizations.mode.type === Mode.Path && (
                    <>
                        <CustomizationItem
                            label={CustomizationLabels.PathLength}
                            value={customizations.mode.path?.pathLength}
                            dataKey={null}
                            onEdit={null}
                        />

                        {
                            (customizations.mode.path?.pathLength ?? 0) > 2 &&
                            <CustomizationItem
                                label={CustomizationLabels.Connections}
                                value={customizations.mode.path?.connections.map(link => link.title).join(", ")}
                                dataKey={null}
                                onEdit={null}
                            />
                        }

                        <CustomizationItem
                            label={CustomizationLabels.Directed}
                            value={customizations.mode.path?.directed ? "true" : "false"}
                            dataKey={null}
                            onEdit={null}
                        />
                    </>
                )
                }

                {customizations.mode.type === Mode.CountDown && (
                    <CustomizationItem
                        label={CustomizationLabels.Timer}
                        value={customizations.mode.count_down?.timer}
                        dataKey={null}
                        onEdit={null}
                    />
                )
                }
            </div>
        </div>
    );
}