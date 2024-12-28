interface CustomizationItemProps {
    label: string;
    value: string | number | undefined;
    dataKey: string | null;
    onEdit: ((dataKey: string | null) => void) | null;
}

export function CustomizationItem({
    label, value, dataKey, onEdit
} : CustomizationItemProps) {
    return (
        <div className="group relative grid grid-cols-3 gap-4 p-1">
            <strong className="text-base mr-1 col-span-1">{label}</strong>
            <p className="col-span-2">{value}</p>

            { onEdit != null && 
                <button 
                data-key={dataKey}
                className="font-custom absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity
                bg-blue-500 text-white px-2 py-1 text-sm rounded"
                onClick={(e) => {
                    const target = e.target as HTMLElement;
                    onEdit(target.getAttribute("data-key"));
                }}>
                    Edit
                </button>
            }
        </div>
    )
}