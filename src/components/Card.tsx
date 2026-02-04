import { NumberTicker } from "@/components/ui/number-ticker";
import { TextAnimate } from "@/components/ui/text-animate";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface CardProps {
    NameRole?: string;
    cnt?: string | number;
    Icons?: ReactNode;
    description?: string;
    className?: string;
    path?: string;
    textColor?: string;
}


function Card({ NameRole, cnt, Icons, className, description, path,textColor }: CardProps) {
    const router = useRouter()
    return (
        <div onClick={() => path && router.push(path)} className={`flex justify-between cursor-pointer  ${className}  bg-white dark:bg-[#1a1a1a] border rounded-sm py-5 px-5`}>
            <aside className="flex flex-col">
                <NumberTicker  className={`text-4xl font-bold text-${textColor}`} value={cnt ?? 0} />
                {/* <TextAnimate animation="slideUp" by="word" className="text-3xl  font-bold">{`${cnt}`}</TextAnimate> */}
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
                    <div className="bg-[#e6edf8] dark:bg-black text-[#0950c3] p-2 rounded-xl">
                        {Icons}
                    </div>
                )
                }
            </aside>
        </div>
    )
}

export default Card