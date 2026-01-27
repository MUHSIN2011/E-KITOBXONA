import { TextAnimate } from "@/components/ui/text-animate";
import { ReactNode } from "react";

interface CardProps {
    NameRole?: string;
    cnt?: string | number;
    Icons?: ReactNode;
    description?: string;
    className?: string;
}


function Card({ NameRole, cnt, Icons, className, description }: CardProps) {
    return (
        <div className={`flex justify-between  ${className}  bg-white border rounded-sm py-5 px-5`}>
            <aside className="flex flex-col gap-1">
                <TextAnimate className="text-[15px] font-semibold text-muted-foreground " animation="slideUp" by="word">
                    {`${NameRole}`}
                </TextAnimate>
                <TextAnimate animation="slideUp" by="word"  className="text-2xl font-bold">{`${cnt}`}</TextAnimate>
                <TextAnimate animation="slideUp" by="word"  className="text-[13px] text-muted-foreground">{`${description}`}</TextAnimate>
            </aside>
            <aside>
                {Icons && (
                    
                    <div className="bg-[#e6edf8]  text-[#0950c3] p-2 rounded-xl">
                        {Icons}
                    </div>
                )
                }
            </aside>
        </div>
    )
}

export default Card