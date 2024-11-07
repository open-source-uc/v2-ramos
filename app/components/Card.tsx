"use client";
import Image from "next/image";

interface Props {
  team: string;
  image: string;
  people: number;
}

export function Card(props: Props) {
  return (
    <div className="h-full w-full p-8">
      <div className="relative h-full w-full">
        <Image className="dark:invert" alt="Next.js logo" src={props.image} height={38} width={180} />
        <div className="flex h-full w-full flex-col justify-end text-black dark:text-white">
          <div className="flex gap-28">
            <p className="text-lg">OSUC {props.team} Team</p>
          </div>
          <p className="text-xs">Currently {props.people} people working</p>
        </div>
      </div>
    </div>
  );
}
