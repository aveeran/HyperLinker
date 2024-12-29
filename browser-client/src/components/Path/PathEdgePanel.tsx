import { useContext } from "react";
import { EdgeInteractionContext } from "./PathContexts/EdgeInteractionContext";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";

function PathEdgePanel() {
    const edgeInteraction = useContext(EdgeInteractionContext);
    const graphSettings = useContext(GraphSettingsContext);

    if (!edgeInteraction || !graphSettings) {
        throw new Error(
            "PathEdgePanel must be used within EdgeInteractionContext and GraphSettingsContext providers"
        );
    }

    const {
        activeEdge,
        edgeHistory
    } = edgeInteraction;

    const {
        freePath,
        path,
        isDirected,
        isPath
    } = graphSettings;

    if (activeEdge === null) return null;

    const startTitle =
        !isDirected && isPath ? freePath[activeEdge]?.title
            : path[activeEdge]?.title;

    const endTitle =
        !isDirected && isPath ? freePath[activeEdge + 1]?.title
            : path[activeEdge + 1]?.title;

    return (
        <div className="mt-4 p-2 border border-green-300 bg-white rounded  shadow-2xl m-2">
            <h3 className="font-bold truncate">
                History for Edge between {startTitle} and {endTitle}
            </h3>
            <ul>
                {
                    edgeHistory?.map((subArray, outerIndex) => (
                        <ul key={outerIndex} className="mb-4">
                            {subArray.map((entry, innerIndex) => (
                                <li key={innerIndex} className="text-sm text-gray-700">
                                    <a href={entry.link} target="_blank" rel="noopener noreferrer">
                                        {entry.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ))
                }
            </ul>
        </div>
    );

}

export default PathEdgePanel;