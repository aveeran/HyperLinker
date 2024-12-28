import React, { useState } from "react";

interface UseMaximizedWidgetsResult {
    maximizedWidgets: string[];
    toggleWidget: (widget: string) => string[];
    setMaximizedWidgets: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useMaximizedWidgets(
    initial: string[] = [],
    limit = 2
) : UseMaximizedWidgetsResult {
    const [maximizedWidgets, setMaximizedWidgets] = useState<string[]>(initial);

    function toggleWidget(widget: string): string[] {
        let updated: string[];

        if(maximizedWidgets.includes(widget)) {
            updated = maximizedWidgets.filter((w) => w !== widget);
        } else if (maximizedWidgets.length < limit) {
            updated = [...maximizedWidgets, widget];
        } else {
            updated = [...maximizedWidgets.slice(1), widget];
        }

        setMaximizedWidgets(updated);
        return updated;
    }

    return {
        maximizedWidgets,
        toggleWidget,
        setMaximizedWidgets
    }
}