import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"


export function Logo() {
	return (
		<Link href="/">
			<div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
				<Image
					src="/logo.svg"
					alt="Logo"
					height={40}
					width={40}
				/>
				<p
					className={cn("text-lg text-neutral-700 pb-1 evic-heading")}
				>
					Evic
				</p>
			</div>
		</Link>
	)
}
