import { Article } from "../../utils/utils";
import React from "react";
import PathNode from "./PathNode";

interface PathRowProps {
    row: Article[],
    rowIndex: number,
    rowLength: number
}

function PathRow({
    row,
    rowIndex,
    rowLength
} : PathRowProps) {
    return (
        <div 
        className={`flex items-center gap-4 
            ${rowIndex % 2 === 0 ? "justify-left" : "justify-right"}`}
        key={`row-${rowIndex}`}
        >
            {
                row.map( (step, index) => (
                    <React.Fragment key={`node-${rowIndex}-${index}`}>
                        {
                            // maybe context would work better here
                            // TODO: ok we will rework this with context
                            <PathNode

                        }

                    </React.Fragment>
                ))
            }
        </div>
    )

}

export default PathRow;