import { Article } from "../../utils/utils";
import React, { useContext } from "react";
import PathNode from "./PathNode"; 
import PathEdge from "./PathEdge";
import { GraphSettingsContext } from "./PathContexts/GraphSettingsContext";

interface PathRowProps {
    row: Article[],
    rowIndex: number,
}

function PathRow({
    row,
    rowIndex
}: PathRowProps) {
    const graphSettings = useContext(GraphSettingsContext);


    if (!graphSettings) {
        throw new Error("PathRow must be used within a GraphSettingsContext provider");
    }

    const { rowLength } = graphSettings;

    return (
        <div
            className={`flex items-center gap-4 
            ${rowIndex % 2 === 0 ? "justify-start" : "justify-end"}`}
            key={`row-${rowIndex}`}
        >
            {
                row.map((step, index) => (
                    <React.Fragment key={`node-${rowIndex}-${index}`}>

                        <PathNode
                            rowIndex={rowIndex}
                            step={step}
                            index={index}
                            rowLength={rowLength} />
                        {
                            index < row.length - 1 && (
                                <PathEdge
                                    rowIndex={rowIndex}
                                    index={index}
                                    rowLength={rowLength}
                                />
                            )
                        }
                    </React.Fragment>
                ))
            }
        </div>
    );
}

export default PathRow;