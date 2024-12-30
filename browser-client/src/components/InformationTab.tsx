interface InformationTabProps<T> {
    component: React.ComponentType<T & {isMaximized: boolean}>
    props: T;
    isMaximized: boolean;
    onToggleMaximize: () => void;
}

const A = <T extends {}>({component: Component, props, isMaximized, onToggleMaximize}: InformationTabProps<T>) => {
    
}