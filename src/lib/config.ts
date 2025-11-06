import type { Member } from "@/types/member";
// SORT YOUR FUCKING CONFIG FILE BY NAME ALPHABETICALLY, this is the most disorganized file in the entire codebase. thanks 06/11/25 - twentyfifteen
export const members: Member[] = [
  {
    name: "cortex",
    link: "https://cortex.rest/",
    github: "refurbishing",
    discord_id: "913205935319691335",
    projects: [
      {
        name: "Equibop",
        description:
          "A custom Discord App aiming to give you better performance and improvements forked from Vesktop",
        url: "https://github.com/Equicord/Equibop",
        icon: "https://raw.githubusercontent.com/Equicord/Equibop/main/static/icon.png",
        type: "website" as const,
      },
      {
        name: "VNREZ",
        description:
          "A utility-suite for Linux that records and screenshots your files easily and uploads them to a file host if desired",
        url: "https://github.com/refurbishing/vnrez",
        icon: "https://raw.githubusercontent.com/refurbishing/vnrez/main/assets/logo.png",
        type: "website" as const,
      },
    ],
  },
  {
    name: "arespro",
    link: "#",
    github: "arespro074",
    discord_id: "573610301140762664",
  },
  {
    name: "nyx",
    link: "https://github.com/verticalsync",
    discord_id: "1207087393929171095",
    github: "verticalsync",
    projects: [
      {
        name: "Equicord",
        description:
          "A fork of Vencord, with over 300+ plugins.",
        url: "https://equicord.org",
        type: "website" as const,
        icon: "https://raw.githubusercontent.com/Equicord/Equibop/main/static/icon.png", // stop using fucking discord cdn as file host this bs breaks so often, thanks 06/11/25 - twentyfifteen
      },
    ],
  },
  {
    name: "john doe",
    link: "#",
    discord_id: "1346505857369772085",
      },
  {
    name: "drag",
    link: "#",
    discord_id: "1189903210564038697",
  },
  {
    name: "body",
    link: "https://body.sh",
    discord_id: "1303758145746767924",
    github: "Body-Alhoha",
    projects: [
      {
        name: "Ectasy",
        description:
          "Ectasy was a popular minecraft/forceop backdoor with 13 000 users online from 2020 to 2024.",
        url: "https://youtu.be/MVtue3WOZCo",
        icon: "https://body.sh/assets/projects/ectasy.png",
        type: "website" as const,
      },
      {
        name: "Hera",
        description: "Hera was an injectable client made for minecaft 1.8.9",
        url: "https://youtu.be/R8PfNni_xZk",
        icon: "https://body.sh/assets/projects/hera.png",
        type: "website" as const,
      },
      {
        name: "Stellar Tweaks",
        description:
          "Stellar Tweaks is an upcoming free and opensource modification for Lunar Client which allows modding, customizing Lunar Client features and much more",
        url: "https://github.com/StellarTweaks",
        icon: "https://avatars.githubusercontent.com/u/195576848", // again stop using discord cdn as file host use github or something else, thanks 06/11/25 - twentyfifteen
        type: "github" as const,
      },
      {
        name: "Turnaround",
        description:
          "Turnaround was a free and opensource solver for Cloudfare's turnstile",
        icon: "https://logos-world.net/wp-content/uploads/2022/04/Cloudflare-Emblem.png",
        url: "https://github.com/Body-Alhoha/turnaround",
        type: "github" as const,
      },
      // This is legit just fucking stellar tweaks again ??? who approved this bs, sometimes brain cells just dont work, - twentyfifteen
      // {
      //   name: "Remake",
      //   description:
      //     "Remake is a free and opensource library to modify Java classes at runtime, without the need of any java agent",
      //   url: "https://github.com/StellarTweaks/Remake",
      //   type: "github" as const,
      // },
    ],
  },
  {
    name: "wiremoney",
    link: "https://firebombed.icu/",
    discord_id: "865911778235908168",
    projects: [{
      name: "Meth Cloud",
      icon: "https://cdn.nest.rip/uploads/bebd0c2a-10dc-4020-a030-64939d5fe279.jpg",
      url: "https://t.me/MethCloudBot",
      description: "log drops, buy accounts, private hotmail and mixed cloud, etc",
      type: "website" as const,
    }],
  },
  {
    name: "bhop",
    link: "https://bhop.rest",
    github: "prettylittlelies",
    discord_id: "442626774841556992",
    projects: [
      {
        name: "Greed",
        description:
          "The only aesthetic multi-functional Discord bot you need.",
        url: "https://greed.best",
        icon: "https://r2.greed.best/greedav.png",
        type: "website" as const,
      },
      {
        name: "evict.bot",
        description:
          "An all-in-one bot that streamlines server management without compromising on aesthetics.",
        url: "https://evict.bot",
        icon: "https://r2.evict.bot/evict-marketing.png",
        type: "website" as const,
      },
      // dead site - twentyfifteen
      // {
      //   name: "Tempt",
      //   description: "A powerful Discord bot for your community",
      //   url: "https://tempt.lol",
      //   icon: "https://cdn.discordapp.com/avatars/1367774588750266408/a271d4855b63b329567c173cbd3557f9.png?size=1024",
      //   type: "website" as const,
      // },
      // STOP USING DISCORD CDN AS FILE HOST FFS, and this is commtented out anyway bcs it linkes to fucking evict.bot / greed site - twentyfifteen
      // {
      //   name: "emogir.ls",
      //   description:
      //     "A premium solution for e-mails, image uploading & showing off your digital portfolio.",
      //   url: "https://emogir.ls",
      //   icon: "https://cdn.discordapp.com/icons/1342461398390673510/9fe83c2624090277777128505ac1bd53.png",
      //   type: "website" as const,
      // },
    ],
  },
  {
    name: "confirmed",
    link: "https://hypixel.lol/",
    discord_id: "657587508837613580", // 1235921714425106493 seconds UserID incase 
    github: "euro-pol",
    // dead or not working site - twentyfifteen
//     projects: [
//       {
//         name: "Hypixel.lol",
//         description: "Private Mail-solution.",
//         url: "https://hypixel.lol/",
//         icon: "https://media.discordapp.net/attachments/1369744751267418316/1372743786362306600/globe_1.png?ex=6827e2c7&is=68269147&hm=e30979dd77a95a354369c69e269ec5f87b354aebb40cab9fe79c5c5e04188eae&=&format=png&quality=lossless", // add logo later on - ares
//         type: "website" as const,
//   },
// ],
  },
  {
    name: "cyp",
    link: "https://privm.net/",
    discord_id: "1356349049049190637",
    github: "cypdev",
    projects: [
      {
        name: "PriVM",
        description: "Privacy Focussed Hosting.",
        url: "https://privm.net/",
        icon: "https://privm.net/storage/logo.webp",
        type: "website" as const,
      },
      {
        name: "Restorio", // - twentyfifteen
        description: "N/A",
        url: "https://restorio.net/",
        icon: "https://restorio.net/restorio.ico",
        type: "website" as const,
      }
    ],
  },
  {
    name: "catchii",
    link: "https://catchii.cat/",
    discord_id: "1403905469751365695",
    projects: [
      {
        name: "guns.lol",
        description:
          "A bio page platform where users can create profiles to showcase their links and social media.",
        url: "https://guns.lol/",
        icon: "https://assets.guns.lol/guns_logo_no_background_cropped.png",
        type: "website" as const,
      },
      {
        name: "MailHaven",
        description: "Your privacy matters. That’s why we created MailHaven, a free secure and privacy-respected email service designed for you.",
        url: "https://mailhaven.su",
        icon: "https://mailhaven.su/logo.png", // stop using discord cdn as file host or dead links to some file host - twentyfifteen
        type: "website" as const,
      }
    ],
  },
  {
    name: "birdie",
    link: "#",
    discord_id: "1250561225733967938", 
  },
  {
    name: "shintomu",
    link: "#",
    discord_id: "1013953531117568051", 
  },
  {
    name: "external",
    link: "#",
    discord_id: "1323491828648906855",
  },
  {
    name: "compile",
    link: "https://tempt.lol",
    discord_id: "659438962624167957",
    // dead site / project - twentyfifteen
    // projects: [
    //   {
    //     name: "Tempt",
    //     description:
    //       "A powerful Discord bot for your community, with a focus on performance and reliability.",
    //     url: "https://tempt.lol",
    //     icon: "https://cdn.discordapp.com/avatars/1367774588750266408/a271d4855b63b329567c173cbd3557f9.png?size=1024", // stop using discord cdn as file host - twentyfifteen
    //     type: "website" as const,
    //   },
    // ],
  }
 
].sort((a, b) => {
  const topOrder = ["arespro", "cortex", "nyx"];
  if (topOrder.includes(a.name) && topOrder.includes(b.name)) return topOrder.indexOf(a.name) - topOrder.indexOf(b.name);
  if (topOrder.includes(a.name)) return -1;
  if (topOrder.includes(b.name)) return 1;
  return (b.projects?.length || 0) - (a.projects?.length || 0);
});
