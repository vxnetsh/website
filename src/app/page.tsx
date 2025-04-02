"use client";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GitHubStats } from "@/lib/actions";
import { fetchGitHub } from "@/lib/actions";
import { members } from "@/lib/config";
import {
  Activity,
  getLanyardData,
  LanyardData,
  LanyardWebSocket,
} from "@/lib/lanyard";
import type { Member, Project } from "@/types/member";
import ColorThief from "colorthief";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ExtendedActivity = Activity & {
  application_id?: string;
};

type ExtendedMember = Member & {
  discord_data?: LanyardData | null;
  stats?: GitHubStats;
};

const extractSpotifyColor = async (
  url: string,
): Promise<[number, number, number] | null> => {
  try {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    return new ColorThief().getColor(img);
  } catch {
    return null;
  }
};

const extractCustomStatus = (activities: ExtendedActivity[]) => {
  return activities?.find(activity => activity.type === 4) || null;
};

export default function Home() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null),
    [currentPage, setCurrentPage] = useState(1),
    [currentActivityIndex, setCurrentActivityIndex] = useState(0),
    [dominantColor, setDominantColor] = useState<
      [number, number, number] | null
    >(null),
    [memberData, setMemberData] = useState<
      Record<
        string,
        Member & {
          discord_data?: LanyardData | null;
          stats?: GitHubStats | null;
          projects?: Project[];
        }
      >
    >({});
  const [lanyardSocket] = useState(() => new LanyardWebSocket());
  const [spotifyProgress, setSpotifyProgress] = useState(0);

  const currentMemberData = selectedMember
    ? memberData[selectedMember.name] || selectedMember
    : null;

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        members.map(async (member) => {
          const lanyard = member.discord_id
            ? await getLanyardData(member.discord_id)
            : null;
          return [member.name, { ...member, discord_data: lanyard }] as const;
        }),
      );

      const memberDataWithLanyard = Object.fromEntries(results);

      const githubUsers = members.filter((m) => m.github).map((m) => m.github!);
      if (githubUsers.length > 0) {
        const stats = await fetchGitHub(githubUsers);
        githubUsers.forEach((github, index) => {
          const member = members.find((m) => m.github === github);
          if (member && stats[index]) {
            memberDataWithLanyard[member.name] = {
              ...memberDataWithLanyard[member.name],
              stats: stats[index],
            };
          }
        });
      }

      setMemberData(memberDataWithLanyard);
    })();

    members.forEach((m) => {
      if (m.discord_id) {
        lanyardSocket.subscribe(m.discord_id, (data: LanyardData) =>
          setMemberData((prev) => ({
            ...prev,
            [m.name]: { ...prev[m.name], discord_data: data },
          })),
        );
      }
    });

    return () => {
      members.forEach((m) => {
        if (m.discord_id) {
          lanyardSocket.unsubscribe(m.discord_id);
        }
      });
    };
  }, [lanyardSocket]);

  useEffect(() => {
    if (!currentMemberData?.discord_data?.spotify?.album_art_url) {
      setDominantColor(null);
      return;
    }

    const spotifyData = currentMemberData.discord_data.spotify;
    const imageId = spotifyData.album_art_url.split("/").pop();
    if (!imageId) return;

    extractSpotifyColor(`https://i.scdn.co/image/${imageId}`)
      .then(setDominantColor)
      .catch(() => setDominantColor(null));

    const updateProgress = () => {
      const now = Date.now();
      const progress = Math.min(
        Math.max(
          (now - spotifyData.timestamps.start) /
            (spotifyData.timestamps.end - spotifyData.timestamps.start),
          0,
        ),
        1,
      );
      setSpotifyProgress(progress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [currentMemberData?.discord_data?.spotify]);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setCurrentPage(1);
  };

  const getAvatarUrl = (
    member: ExtendedMember & {
      discord_data?: LanyardData | null;
      stats?: {
        repos: number;
        followers: number;
        contributions: number;
        avatar_url: string;
        bio: string | null;
      } | null;
    },
  ) => {
    if (member.discord_data?.discord_user.avatar) {
      return `https://cdn.discordapp.com/avatars/${member.discord_id}/${member.discord_data.discord_user.avatar}.png?size=256`;
    }
    if (member.github) {
      return (
        member.stats?.avatar_url || `https://github.com/${member.github}.png`
      );
    }
    return null;
  };

  const getStatusColor = (status?: "online" | "idle" | "dnd" | "offline") => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderStatusIndicator = (
    member: ExtendedMember & {
      discord_data?: LanyardData | null;
    },
    size: "sm" | "lg",
  ) => {
    if (!member.discord_data) return null;
    const sizeClasses = size === "sm" ? "w-2.5 h-2.5" : "w-6 h-6";
    const borderClasses = size === "sm" ? "border-[2.5px]" : "border-[3px]";
    return (
      <div
        className={`absolute -bottom-[2px] -right-[2px] ${sizeClasses} rounded-full ${borderClasses} ${getStatusColor(member.discord_data.discord_status)}`}
        style={{ borderColor: "rgb(35, 35, 35)" }}
      />
    );
  };

  const renderCustomStatus = (customStatus: ExtendedActivity) => {
    return (
      <motion.div 
        className="flex items-center gap-1.5 text-sm text-white/60 mt-1"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {customStatus.emoji && (
          customStatus.emoji.id ? (
            <img
              src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}`}
              alt={customStatus.emoji.name}
              className="w-4 h-4 flex-shrink-0"
            />
          ) : (
            <img
              src={`https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${customStatus.emoji.name.codePointAt(0)?.toString(16)}.svg`}
              alt={customStatus.emoji.name}
              className="w-4 h-4 flex-shrink-0"
            />
          )
        )}
        <span>{customStatus.state}</span>
      </motion.div>
    );
  };

  const renderActivities = (activities: ExtendedActivity[]) => {
    const filteredActivities = activities.filter(activity => activity.type !== 4);
    
    if (!filteredActivities.length) return null;

    const activity = filteredActivities[currentActivityIndex % filteredActivities.length];

    const nextActivity = () => {
      setCurrentActivityIndex((prev) => (prev + 1) % filteredActivities.length);
    };

    const prevActivity = () => {
      setCurrentActivityIndex(
        (prev) => (prev - 1 + filteredActivities.length) % filteredActivities.length,
      );
    };

    const isSpotify = activity.name === "Spotify";
    const spotifyData = isSpotify && currentMemberData?.discord_data?.spotify;

    return (
      <motion.div
        layout="position"
        className="flex flex-col gap-1 bg-white/5 rounded-md p-2 w-full relative overflow-hidden select-none"
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x > rect.width / 2) {
            nextActivity();
          } else {
            prevActivity();
          }
        }}
      >
        {filteredActivities.length > 1 && (
          <div className="absolute top-1 right-2 text-xs text-white/40">
            {(currentActivityIndex % filteredActivities.length) + 1}/{filteredActivities.length}
          </div>
        )}

        {isSpotify && spotifyData && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <motion.div
              className="h-full"
              style={{
                backgroundColor: dominantColor
                  ? `rgb(${dominantColor.join(",")})`
                  : "rgb(255, 255, 255, 0.6)",
                boxShadow: dominantColor
                  ? `0 0 10px rgb(${dominantColor.join(",")})`
                  : "0 0 10px rgba(255, 255, 255, 0.6)",
              }}
              initial={{ width: "0%", opacity: 0.6 }}
              animate={{ width: `${spotifyProgress * 100}%`, opacity: 0.8 }}
              transition={{ duration: 0.3, ease: "linear" }}
            />
          </motion.div>
        )}

        <motion.div
          layout="position"
          className="flex items-center gap-2"
          key={activity.name + (currentActivityIndex % filteredActivities.length)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activity.assets?.large_image ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              src={
                activity.assets.large_image.startsWith("mp:external/")
                  ? `https://${activity.assets.large_image.split("/").slice(3).join("/")}`
                  : activity.assets.large_image.startsWith("spotify:")
                    ? `https://i.scdn.co/image/${activity.assets.large_image.split(":")[1]}`
                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
              }
              alt={activity.name}
              className="w-12 h-12 rounded-md flex-shrink-0 object-cover"
            />
          ) : null}
          <motion.div
            layout="position"
            className="flex flex-col min-w-0 flex-1"
          >
            <motion.span
              layout="position"
              className="text-sm font-medium break-words"
            >
              {activity.name}
            </motion.span>
            {activity.details && (
              <motion.span
                layout="position"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-xs text-white/60 break-words"
              >
                {activity.details}
              </motion.span>
            )}
            {activity.state && (
              <motion.span
                layout="position"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-xs text-white/60 break-words"
              >
                {activity.state?.replace(/;/g, ",")}
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {filteredActivities.length > 1 && (
          <div className="flex justify-center mt-1 gap-1">
            {filteredActivities.map((_, idx) => (
              <div
                key={idx}
                className={`w-1 h-1 rounded-full ${idx === currentActivityIndex % filteredActivities.length ? "bg-white/60" : "bg-white/20"}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="font-kode w-full min-h-screen flex items-center justify-center gradient-bg relative">
      <motion.div
        className="absolute top-4 left-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link href="https://github.com/vxnetsh/website" target="_blank">
          <div className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#a0a0a0"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        </Link>
      </motion.div>
      <div className="container mx-auto flex flex-col gap-6 p-6">
        <motion.div
          className="flex-1 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div className="flex flex-col items-center justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [0.175, 0.885, 0.32, 1.275],
              }}
            >
              <Image
                src="/icon.png"
                className="rounded-md"
                alt="logo"
                width={225}
                height={225}
                priority
              />
            </motion.div>
            <motion.span
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              vxnet
            </motion.span>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex justify-center items-center gap-1">
              {members.slice(0, 2).map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.8 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="flex items-center gap-1"
                >
                  <Card
                    className="px-4 py-1 cursor-pointer transition-all hover:bg-white/10 bg-transparent relative"
                    onClick={() => handleMemberSelect(member)}
                  >
                    <div className="flex items-center gap-2">
                      {member.discord_id &&
                        memberData[member.name]?.discord_data && (
                          <div className="relative">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={
                                  getAvatarUrl(memberData[member.name]) || ""
                                }
                                alt={member.name}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            {renderStatusIndicator(
                              memberData[member.name],
                              "sm",
                            )}
                          </div>
                        )}
                      <span className="text-base font-medium">
                        {member.name}
                      </span>
                    </div>
                  </Card>

                  {index === 0 && (
                    <span className="text-white/20 w-4 text-center">•</span>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              {members.slice(2).map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.0 + index * 0.03,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="flex items-center gap-1"
                >
                  <Card
                    className="grow px-3 py-2 cursor-pointer transition-all hover:bg-white/10 bg-transparent relative"
                    onClick={() => handleMemberSelect(member)}
                  >
                    <div className="flex justify-center items-center gap-2">
                      {member.discord_id &&
                        memberData[member.name]?.discord_data && (
                          <div className="relative">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={
                                  getAvatarUrl(memberData[member.name]) || ""
                                }
                                alt={member.name}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            </div>
                            {renderStatusIndicator(
                              memberData[member.name],
                              "sm",
                            )}
                          </div>
                        )}
                      <span className="text-sm">{member.name}</span>
                    </div>
                  </Card>

                  {(index + 1) % 3 !== 0 && index !== members.length - 3 && (
                    <span className="text-white/20 hidden sm:block w-4 text-center">
                      •
                    </span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <Dialog
          open={!!selectedMember}
          onOpenChange={(open) => !open && setSelectedMember(null)}
        >
          <DialogContent className="max-w-[90vw] sm:max-w-md bg-background">
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentMemberData && (
                <>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="relative self-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-white/5">
                        {getAvatarUrl(currentMemberData) ? (
                          <img
                            src={getAvatarUrl(currentMemberData) ?? undefined}
                            alt={currentMemberData.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                            {currentMemberData.name[0]}
                          </div>
                        )}
                      </div>
                      {currentMemberData.discord_data &&
                        renderStatusIndicator(currentMemberData, "lg")}
                    </motion.div>

                    <motion.div
                      className="flex flex-col flex-1 min-h-[80px] justify-center"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2">
                          <span className="font-semibold">
                            {currentMemberData.name}
                          </span>
                          {currentMemberData.link &&
                            currentMemberData.link !== "#" && (
                              <Link
                                href={currentMemberData.link}
                                target="_blank"
                                className="text-white/40 hover:text-white/80 transition-colors duration-300"
                              >
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 15 15"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </Link>
                            )}
                        </DialogTitle>
                      </div>

                      {currentMemberData.discord_data && (
                        <span className="text-sm text-white/60">
                          @
                          {currentMemberData.discord_data.discord_user.username}
                        </span>
                      )}
                      
                      {currentMemberData.discord_data?.activities && 
                       extractCustomStatus(currentMemberData.discord_data.activities) && 
                       renderCustomStatus(extractCustomStatus(currentMemberData.discord_data.activities)!)}

                      {currentMemberData.discord_data?.activities && (
                        <div className="mt-1">
                          {renderActivities(
                            currentMemberData.discord_data.activities,
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {currentMemberData.github && currentMemberData.stats && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-white/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Link
                          href={`https://github.com/${currentMemberData.github}`}
                          target="_blank"
                          className="text-sm flex items-center gap-1.5 text-white/60 hover:text-white/80 transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                            fill="currentColor"
                          >
                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                          </svg>
                          <span>@{currentMemberData.github}</span>
                        </Link>
                        <div className="flex gap-2 text-xs">
                          <Link
                            href={`https://github.com/${currentMemberData.github}?tab=followers`}
                            target="_blank"
                            className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full text-white/60 transition-colors duration-300"
                          >
                            {currentMemberData.stats.followers} followers
                          </Link>
                          <Link
                            href={`https://github.com/${currentMemberData.github}?tab=repositories`}
                            target="_blank"
                            className="bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-full text-white/60 transition-colors duration-300"
                          >
                            {currentMemberData.stats.repos} repos
                          </Link>
                          {currentMemberData.stats.stars > 4 && (
                            <div className="bg-white/5 px-2 py-0.5 rounded-full text-white/60 flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                width="12"
                                height="12"
                                fill="currentColor"
                              >
                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                              </svg>
                              {currentMemberData.stats.stars}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentMemberData.projects &&
                    currentMemberData.projects.length > 0 &&
                    (currentMemberData.projects[0].type !== "github" ||
                      (currentMemberData.github &&
                        currentMemberData.stats)) && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <h3 className="text-sm font-medium mb-3">Projects</h3>
                        <div className="grid gap-2">
                          {currentMemberData.projects
                            .slice((currentPage - 1) * 2, currentPage * 2)
                            .map((project, idx) => (
                              <motion.div
                                key={project.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.4 + idx * 0.1,
                                  ease: "easeOut",
                                }}
                              >
                                <Link
                                  href={project.url}
                                  target="_blank"
                                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-md p-2.5"
                                >
                                  <div className="w-8 h-8 shrink-0 rounded-md bg-white/10 flex items-center justify-center">
                                    {project.icon ? (
                                      <img
                                        src={project.icon}
                                        alt=""
                                        className="w-full h-full rounded-md object-cover"
                                      />
                                    ) : project.type === "github" ? (
                                      <svg
                                        className="w-4 h-4 text-white/60"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                      >
                                        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-4 h-4 text-white/60"
                                        viewBox="0 0 15 15"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3H6.5C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-sm font-medium break-words">
                                      {project.name}
                                    </span>
                                    <span className="text-xs text-white/60 break-words">
                                      {project.description}
                                    </span>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                        </div>
                        {currentMemberData?.projects?.length > 2 && (
                          <motion.div
                            className="flex justify-center gap-2 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.6,
                              ease: "easeOut",
                            }}
                          >
                            {Array.from(
                              {
                                length: Math.ceil(
                                  (currentMemberData?.projects?.length ?? 0) /
                                    2,
                                ),
                              },
                              (_, i) => (
                                <motion.button
                                  key={i + 1}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`w-2 h-2 p-2 rounded-full relative transition-colors duration-300 ${
                                    currentPage === i + 1
                                      ? "bg-white/60"
                                      : "bg-white/10 hover:bg-white/20"
                                  }`}
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                  animate={
                                    currentPage === i + 1
                                      ? {
                                          scale: [1, 1.2, 1],
                                          transition: { duration: 0.5 },
                                        }
                                      : { scale: 1 }
                                  }
                                >
                                  <motion.span
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={
                                      currentPage === i + 1
                                        ? { opacity: 1 }
                                        : { opacity: 0.7 }
                                    }
                                  >
                                    <motion.span
                                      className="w-3 h-3 rounded-full"
                                      layoutId="activeDot"
                                      transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                      }}
                                    />
                                  </motion.span>
                                </motion.button>
                              ),
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                </>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
