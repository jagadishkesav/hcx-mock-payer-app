import { CheckIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export type ChecklistItem = {
    id: string,
    name: string,
    status?: "pass" | "fail" | "na"
}

export default function Checklist(props: {
    scores: {
        pass: number,
        fail: number,
        na: number
    },
    items: ChecklistItem[],
    setItems: (items: ChecklistItem[]) => void
}) {
    const { scores, items, setItems } = props;

    const score = items?.filter(item => item.status === "pass").length || 0;
    const progressColor = score >= scores.pass ? "bg-green-500" : (score >= scores.na ? "bg-yellow-500" : "bg-red-500");

    return (
        <div className="w-[250px]">
            <h1 className="font-bold text-lg">Checklist</h1>
            <div className="my-2 text-sm text-gray-600">
                <div className="mb-1 text-right">Score {score} / {scores.pass}</div>
                <div className="flex gap-1 items-stretch h-[5px]">
                    {Array(scores.pass).fill(0).map((_, index) => (
                        <div key={index} className={`flex-1 ${index === 0 ? "rounded-l-full" : ""} ${index === scores.pass - 1 ? "rounded-r-full" : ""} ${score > index ? progressColor : "bg-gray-300"}`} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-8">
                {items && items.map((item, index) => (
                    <div key={index} className="flex justify-between gap-2">
                        <div>
                            {item.name}
                        </div>
                        <div className="shrink-0">
                            <div className="flex items-center gap-1">
                                {[{ status: "pass", color: "green", icon: CheckIcon }, { status: "na", color: "yellow", icon: MinusIcon }, { status: "fail", color: "red", icon: XMarkIcon }].map((status, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setItems(items.map((it) => {
                                            return item.id === it.id ? { ...it, status: status.status as any } : it
                                        }))}
                                        className={`p-1 rounded-full hover:bg-gray-200 transition ${item.status === status.status ? `bg-${status.color}-500` : "bg-gray-300"}`}
                                    >
                                        <status.icon className={`h-4 w-4 text-${status.color}-500`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}