import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import { ReactNode } from "react";

interface CardProps {
    NameRole?: string;
    cnt?: string | number;
    Icons?: ReactNode;
    description?: string;
    className?: string;
}


function CardsStudent({ NameRole, cnt, Icons, className, description }: CardProps) {
    return (
        <div className={`flex  gap-5 items-center  ${className}  bg-white border rounded-sm py-5 px-5`}>
            <aside>
                {Icons && (
                    <div className="bg-[#e6edf8]  text-[#0950c3] p-2 rounded-xl">
                        {Icons}
                    </div>
                )}
            </aside>
            <aside className="flex flex-col ">
                <TextAnimate className="text-[15px] font-semibold text-muted-foreground " animation="slideUp" by="word">
                    {`${NameRole}`}
                </TextAnimate>
                <NumberTicker className="text-[23px] font-bold" value={cnt ?? 0} />
                {description && (
                    <TextAnimate animation="slideUp" by="word" className="text-[13px] text-muted-foreground">{`${description}`}</TextAnimate>
                )}
            </aside>
        </div>
    )
}

export default CardsStudent