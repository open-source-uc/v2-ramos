"use client";
import Image from "next/image"

interface Props {
    team: string
    image: string
    people: number
}

export function Card(props: Props) {
    return (
        <div className="p-8 w-full h-full">
            <div className="relative w-full h-full">
                <Image
                    className="dark:invert"
                    alt="Next.js logo"
                    src={props.image}
                    height={38}
                    width={180}
                />
                <div className="flex flex-col w-full h-full justify-end">
                    <div className="flex gap-28">
                        <p className="text-lg">OSUC {props.team} Team</p>
                        
                    </div>
                    <p className="text-xs">Currently {props.people} people working</p>
                </div>
            </div>
        </div>
    );
};