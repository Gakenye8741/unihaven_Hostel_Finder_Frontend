import React, { type ReactNode } from "react";

interface CardProps {
    children: ReactNode;
}

const OwnerCard: React.FC<CardProps> = ({ children }) =>  {
    return (
        <div className="p-3">
            {children}
        </div>
    )
}

export default OwnerCard;