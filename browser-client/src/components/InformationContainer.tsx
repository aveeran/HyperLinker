import { useState } from "react"

interface InformationContainerProps {
    components: {
        component: React.ComponentType<any>;
        props: any;
    }[];
}

const InformationContainer: React.FC<InformationContainerProps> = ({components}) => {
    const [maximizedIndex, setMaximizedIndex] = useState<number|null>(null);

    const handleMaximize = (index: number) => {
        setMaximizedIndex((prev) => (prev===index ? null : index));
    }

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map(({
                component: Component, props
            }, index) => (
                <div 
                key={index}
                className={`border p-4 ${
                    maximizedIndex === index ? "w-full h-screen" : "w-1/2 h-1/2"
                  } transition-all`}>

                    <button onClick={()=>handleMaximize(index)}>{maximizedIndex===index ? "minimize" : "maximize"}</button>
                    <Component {...props} isMaximized={maximizedIndex===index}/>?
                </div>
            ))}
        </div>
    )
}

export default InformationContainer;