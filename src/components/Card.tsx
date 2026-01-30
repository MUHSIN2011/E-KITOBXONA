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
            <aside className="flex flex-col">
                <TextAnimate animation="slideUp" by="word" className="text-3xl  font-bold">{`${cnt}`}</TextAnimate>
                <TextAnimate className="  text-foreground text-sm " animation="slideUp" by="word">
                    {`${NameRole}`}
                </TextAnimate>
                {
                    description && (
                        <TextAnimate animation="slideUp" by="word" className="text-[13px] text-muted-foreground">{`${description}`}</TextAnimate>
                    )
                }
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