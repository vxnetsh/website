"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const members = [
	{ name: "cortex", link: "https://cortex.rest/" },
	{ name: "ares", link: "#" },
	{ name: "vera", link: "https://t.me/mumri_k" },
	{ name: "woosh", link: "https://woosh.ing/" },
	{ name: "body", link: "https://body.sh" },
	{ name: "crxa", link: "https://crxaw.tech/" },
	{ name: "wiremoney", link: "https://firebombed.icu/" },
	{ name: "nyx", link: "https://github.com/verticalsync" },
	{ name: "vmohammad", link: "https://vmohammad.dev/" },
	{ name: "cyprian", link: "https://privm.net/" },
	{ name: "ic3", link: "https://ic3.cash/" },
	{ name: "catchii", link: "https://catchii.cat/" },
	{ name: "bird", link: "#" },
	{ name: "external", link: "#" },
	{ name: "slurpee", link: "#" },
	{ name: "epik", link: "https://epikest.moe" },
	{ name: "hex", link: "https://femboy.cat" },
];

export default function Home() {
	return (
		<div className="font-kode w-full min-h-screen flex flex-col items-center justify-center gap-6 gradient-bg relative">
			<motion.div 
				className="absolute top-4 left-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				<Link href="https://github.com/vxnetsh/website" target="_blank">
					<div className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-all duration-300">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#a0a0a0">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
					</div>
				</Link>
			</motion.div>
			
			<motion.div 
				className="flex flex-col items-center justify-center gap-4"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: "easeOut" }}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ 
						duration: 0.8, 
						delay: 0.2, 
						ease: [0.175, 0.885, 0.32, 1.275] // Custom cubic bezier for a nice elastic effect
					}}
				>
					<Image src="/icon.png" className="rounded-md" alt="logo" width={256} height={256} />
				</motion.div>
				<motion.span 
					className="text-3xl font-bold"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
				>
					vxnet
				</motion.span>
			</motion.div>
			<motion.div 
				className="flex flex-col gap-2"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
			>
				<div className="flex justify-center items-center">
					{members.slice(0, 1).map((member, index) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.5, 
								delay: 0.8 + (index * 0.05), 
								ease: "easeOut" 
							}}
						>
							{member.link === "#" ? (
								<div className="text-md hover:bg-white/10 px-2 py-[1px] transition-all duration-300 rounded-sm text-center cursor-default">
									<span>{member.name}</span>
								</div>
							) : (
								<Link href={member.link} target="_blank">
									<div className="text-md hover:bg-white/10 px-2 py-[1px] transition-all duration-300 rounded-sm text-center cursor-pointer">
										<span>{member.name}</span>
									</div>
								</Link>
							)}
						</motion.div>
					))}
					<motion.div 
						className="flex items-center justify-center px-2 text-white/50"
						initial={{ opacity: 0, scaleY: 0.5 }}
						animate={{ opacity: 1, scaleY: 1 }}
						transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
					>
						<span className="text-lg">•</span>
					</motion.div>
					{members.slice(1, 2).map((member, index) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.5, 
								delay: 0.9 + (index * 0.05), 
								ease: "easeOut" 
							}}
						>
							{member.link === "#" ? (
								<div className="text-md hover:bg-white/10 px-2 py-[1px] transition-all duration-300 rounded-sm text-center cursor-default">
									<span>{member.name}</span>
								</div>
							) : (
								<Link href={member.link} target="_blank">
									<div className="text-md hover:bg-white/10 px-2 py-[1px] transition-all duration-300 rounded-sm text-center cursor-pointer">
										<span>{member.name}</span>
									</div>
								</Link>
							)}
						</motion.div>
					))}
				</div>
				<div className="grid grid-cols-3 gap-2">
					{members.slice(2).map((member, index) => (
						<motion.div
							key={member.name}
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.4, 
								delay: 1.0 + (index * 0.05), 
								ease: "easeOut" 
							}}
							whileHover={{ 
								scale: 1.05,
								transition: { duration: 0.2 }
							}}
						>
							{member.link === "#" ? (
								<div className="w-full h-full text-md hover:bg-white/10 px-[2px] py-[1px] transition-all duration-300 rounded-sm text-center cursor-default">
									<span>{member.name}</span>
								</div>
							) : (
								<Link href={member.link} target="_blank">
									<div className="w-full h-full text-md hover:bg-white/10 px-[2px] py-[1px] transition-all duration-300 rounded-sm text-center cursor-pointer">
										<span>{member.name}</span>
									</div>
								</Link>
							)}
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
