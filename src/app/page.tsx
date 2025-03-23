import Image from "next/image";
import Link from "next/link";

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
	{ name: "cyprian", link: "https://ksawier.com/" },
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
		<div className="font-kode w-full min-h-screen flex flex-col items-center justify-center gap-6 bg-[#1a181b]">
			<div className="flex flex-col items-center justify-center gap-4">
				<Image src="/icon.png" alt="logo" width={136} height={136} />
				<span className="text-3xl font-bold">vxnet</span>
			</div>
			<div className="grid grid-cols-3 gap-2">
				{members.map((member) => (
					<Link href={member.link} key={member.name} target={member.link == "#" ? "_self" : "_blank"}>
						<div className="w-full h-full text-md hover:bg-white/10 px-[2px] py-[1px] transition-all duration-300 rounded-sm text-center cursor-pointer">
							<span>{member.name}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
