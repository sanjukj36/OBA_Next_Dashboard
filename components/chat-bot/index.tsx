"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { PopoverClose } from "@radix-ui/react-popover";
import { AxiosError } from "axios";
import { Loader, Volume2, X } from "lucide-react";
import Image from "next/image";
import Recorder from "recorder-js"; // or use the appropriate import

import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge";
import WaveSurfer from "wavesurfer.js";
import chatBotImage from "@/assets/chat-bot_235x235.png";
import chatBotChatIcon from "@/assets/chat-bot-chat-icon.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { audioToTextApi, sendChatText } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-provider";
import { useChatBotStore } from "@/store/chat-bot-store";
import { AudioIcon } from "./icons/audio-icon";
import { ChatBotIcon } from "./icons/chat-bot-icon";
import { MessageUserIcon } from "./icons/message-user-icon";
import { SendIcon } from "./icons/send-icon";

const ChatBotChatIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        "h-[31px] w-[31px] overflow-hidden rounded-full border-[1px] border-white",
        className
      )}
    >
      <Image src={chatBotChatIcon} className="w-full" alt="chat bot icon" />
    </div>
  );
};

const ChatBody = () => {
  const { chat } = useChatBotStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);
  return (
    <div className="no-scrollbar flex h-[200px] w-full flex-1 flex-col gap-1.5 overflow-y-auto px-2 pb-4 font-alexandria xl:h-[30vh] screen-1360:h-[280px] screen-1366:h-[279px] 2xl:h-[288px] 2xl:gap-3 2xl:px-4 2xl:pb-8 3xl:h-[500px]">
      <div className="flex-1" />
      {chat.length > 0 ? (
        chat.map((item, index) => {
          return (
            <ChatMessageItem
              answer={item.answer}
              owner={item.owner}
              error={item.error}
              loading={item.loading}
              blob={item.blob}
              key={index}
            />
          );
        })
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center object-cover lg:object-cover xl:object-cover 2xl:object-cover 3xl:object-cover">
          <Image src={chatBotImage} alt="chat bot image" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

type ChatMessageItemProps = {
  answer?: string;
  transcription?: string;
  owner: "user" | "bot";
  error?: boolean;
  loading?: boolean;
  blob?: Blob;
};

const ChatMessageItem = ({
  owner,
  answer,
  error,
  loading,
  blob
}: ChatMessageItemProps) => {
  if (owner === "user") {
    const classNames = error
      ? "border-destructive text-destructive"
      : "border-white text-white";
    return (
      <div className="flex w-full font-alexandria text-[10px] xl:text-[14px] 2xl:text-[20px]">
        <div className="ml-auto flex items-start gap-1 justify-self-end">
          {loading ? (
            <Skeleton
              className={twMerge(
                "h-[44px] w-[186px] rounded-[20px] rounded-tr-none xl:h-[53px] xl:w-[220px] 2xl:h-[64px] 2xl:w-[360px]"
              )}
            />
          ) : blob ? (
            <PlayAudioMessageNew
              blob={blob}
              className="max-w-[221px] rounded-[20px] rounded-tr-none border border-white p-[10px] text-white xl:max-w-[263px] xl:p-[12px] 2xl:max-w-[360px] 2xl:p-4"
              transcript={answer ?? ""}
            />
          ) : (
            <div
              className={twMerge(
                "prose max-w-[221px] rounded-[20px] rounded-tr-none border p-[10px] font-alexandria text-white xl:max-w-[263px] xl:p-[12px] 2xl:max-w-[360px] 2xl:p-4",
                classNames
              )}
            >
              <Markdown remarkPlugins={[remarkGfm]}>{answer ?? ""}</Markdown>
            </div>
          )}
          <MessageUserIcon className="h-[22px] w-[22px] 2xl:h-[31px] 2xl:w-[31px]" />
        </div>
      </div>
    );
  }
  if (owner === "bot") {
    const classNames = error
      ? "border-destructive text-destructive"
      : "border-white text-white";
    return (
      <div className="flex items-start gap-1 font-alexandria text-[10px] xl:text-[14px] 2xl:text-[20px]">
        <ChatBotChatIcon className="h-[22px] w-[22px] 2xl:h-[31px] 2xl:w-[31px]" />
        {loading ? (
          <Skeleton
            className={twMerge(
              "h-[44px] w-[186px] rounded-[20px] rounded-tl-none xl:h-[53px] xl:w-[220px] 2xl:h-[64px] 2xl:w-[360px]"
            )}
          />
        ) : blob ? (
          <PlayAudioMessageNew
            blob={blob}
            className="max-w-[221px] rounded-[20px] rounded-tl-none border p-[10px] xl:max-w-[263px] xl:p-[12px] 2xl:max-w-[360px] 2xl:p-4"
            transcript={answer ?? ""}
          />
        ) : (
          <div
            className={twMerge(
              "prose max-w-[221px] rounded-[20px] rounded-tl-none border p-[10px] font-alexandria text-white xl:max-w-[263px] xl:p-[12px] 2xl:max-w-[360px] 2xl:p-4",
              classNames
            )}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{answer ?? ""}</Markdown>
          </div>
        )}
      </div>
    );
  }
};

const PlayAudioMessageNew = ({
  blob,
  className,
  transcript
}: {
  blob: Blob;
  className?: string;
  transcript?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    audioRef.current = new Audio(url);

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener("ended", handleEnded);
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  const handleTogglePlayAndPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <div
      className={twMerge(
        "flex min-w-[186px] max-w-[360px] flex-col gap-1 rounded-[25px] rounded-tr-none border border-white p-4 font-alexandria text-white xl:min-w-[220px] 2xl:min-w-[300px]",
        className
      )}
    >
      <div className="prose text-xxs text-white 3xl:text-[17px] font-alexandria 2xl:text-xs">
        <Markdown remarkPlugins={[remarkGfm]}
        >
          {transcript ?? ""}
        </Markdown>
      </div>
      <div className="flex">
        <button className={twMerge("mr-auto hover:opacity-80 rounded-full transition-all p-1", isPlaying && "bg-white text-black")} onClick={handleTogglePlayAndPause}>
          <Volume2 size={16} />
        </button>
      </div>
    </div>
  );
};

const PlayAudioMessage = ({
  blob,
  className,
  transcript
}: {
  blob: Blob;
  className?: string;
  transcript?: string;
}) => {
  const [show, setShow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    waveSurferRef.current = WaveSurfer.create({
      container: waveformContainerRef.current!,
      waveColor: "#FFFFFF",
      progressColor: "#0085C9",
      height: 52,
      barWidth: 2,
      normalize: true
    });
    waveSurferRef.current.on("play", () => setIsPlaying(true));
    waveSurferRef.current.on("pause", () => setIsPlaying(false));
    waveSurferRef.current.on("finish", () => setIsPlaying(false));
    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.loadBlob(blob);
    }
  }, [blob]);

  return (
    <div
      className={twMerge(
        "flex min-w-[186px] max-w-[360px] flex-col rounded-[25px] rounded-tr-none border border-white p-4 font-alexandria text-white xl:min-w-[220px] 2xl:min-w-[300px]",
        className
      )}
    >
      <div className="flex gap-1.5 2xl:gap-2">
        <button
          onClick={() => {
            if (waveSurferRef.current) {
              waveSurferRef.current.playPause();
            }
          }}
        >
          {isPlaying ? <PauseButtonIcon /> : <PlayButtonIcon />}
        </button>
        <div
          ref={waveformContainerRef}
          className={cn({
            "h-[52px] w-full": blob,
            hidden: !blob
          })}
        />
      </div>
      {transcript && (
        <div className="flex flex-col font-alexandria text-muted-foreground">
          <p
            onClick={() => setShow(!show)}
            className="text-xs text-blue-700 underline hover:text-blue-600 2xl:text-xs"
          >
            transcript
          </p>
          {show && (
            <p className="prose text-xxs text-white 2xl:text-xs">
              <Markdown remarkPlugins={[remarkGfm]}>
                {transcript ?? ""}
              </Markdown>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const PlayButtonIcon = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 10.5L31.5 21L14 31.5V10.5Z"
        fill="#0085C9"
        stroke="#0085C9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PauseButtonIcon = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.1667 30.0837V7.91699H28.5V30.0837H22.1667ZM9.5 30.0837V7.91699H15.8333V30.0837H9.5Z"
        fill="#0085C9"
      />
    </svg>
  );
};

type MessageType = "text" | "audio";

let audioContextNew: AudioContext;
const AudioSendMessage = ({
  setMessageType,
  setMessageText
}: {
  setMessageType: Dispatch<SetStateAction<MessageType>>;
  setMessageText: Dispatch<SetStateAction<string>>;
}) => {
  const recorderRef = useRef<Recorder | null>(null);
  const [isRecording, setIsRecording] = useState(true);
  const [blob, setBlob] = useState<Blob | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    waveSurferRef.current = WaveSurfer.create({
      container: waveformContainerRef.current!,
      waveColor: "#FFFFFF",
      progressColor: "#0085C9",
      height: 52,
      barWidth: 2,
      normalize: true
    });
    audioContextNew = new window.AudioContext();
    recorderRef.current = new Recorder(audioContextNew);
    audioContextNew
      .resume()
      .catch(err => console.error("Failed to resume AudioContext", err));
    startRecording();
    return () => {
      audioContextNew
        .close()
        .catch(err => console.error("Failed to close AudioContext", err));
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!recorderRef.current) {
        console.error("Recorder not initialized");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await recorderRef.current.init(stream);
      await recorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording.", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recorderRef.current) {
        const { blob } = await recorderRef.current.stop()!;
        setIsRecording(false);
        clearInterval(timerRef.current!);
        setBlob(blob);
        if (waveSurferRef.current) {
          waveSurferRef.current.loadBlob(blob);
        }
        sendAudioMessage(blob);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const sendAudioMessage = async (blob: Blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", blob, "recording.wav");

      if (!token) throw new Error("Token not found.");
      const res = await audioToTextApi(formData, token);
      if (res.status === 200 && res.data.success) {
        const { data } = res.data;
        setMessageText(data.transcription);
        setMessageType("text");
        /*
          if (data.blob) {
            const base64 = String(data.blob);
            const audioBlob = new Blob(
              [Uint8Array.from(atob(base64), c => c.charCodeAt(0))],
              { type: "audio/wav" }
            );
            addChat({
              answer: data.answer,
              owner: "bot",
              blob: audioBlob
            });
          } else {
            addChat({ answer: data.transcription, owner: "bot" });
          }
            */
      } else {
        throw new Error(res.data.message ?? "Unknow error occured.");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        console.error(e);
        return;
      }
      if (e instanceof Error) {
        console.error(e);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-1 px-3 py-1 font-alexandria">
      <div className="ring-none h-[70px] flex-1 rounded-[30px] border border-x-0 border-[#555555] bg-[#111111] px-6 py-[11px] font-alexandria outline-none focus:outline-none focus:ring-transparent lg:text-[18px] xl:text-[18px] 3xl:text-[9px]">
        {isRecording && (
          <div className="flex h-full w-full flex-1 items-center justify-center">
            <span className="lg:text-[15px] xl:text-[15px] 3xl:text-[20px]">
              Recording...
            </span>
          </div>
        )}
        {
          <div className="flex w-full gap-1">
            {blob && (
              <button
                onClick={() => {
                  if (waveSurferRef.current) {
                    waveSurferRef.current.playPause();
                  }
                }}
              >
                <PlayButtonIcon />
              </button>
            )}
            <div
              ref={waveformContainerRef}
              className={cn({
                "h-[52px] w-full": blob,
                hidden: !blob
              })}
            />
          </div>
        }
      </div>
      <div className="ml-auto">
        {loading ? (
          <Loader className="pointer-events-none animate-spin" />
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            className="flex h-[70px] w-[80px] items-center justify-center rounded-[30px] border border-x-0 border-[#555555] bg-[#111111]"
          >
            <AudioIcon className="animate-pulse stroke-destructive" />
          </button>
        ) : (
          <button
            disabled
            // onClick={sendAudioMessage}
            className="flex h-[70px] w-[80px] items-center justify-center rounded-[30px] border border-x-0 border-[#555555] bg-[#111111]"
          >
            <SendIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const TextSendMessage = ({
  setMessageType,
  textValue,
  setTextValue
}: {
  setMessageType: Dispatch<SetStateAction<MessageType>>;
  textValue: string;
  setTextValue: Dispatch<SetStateAction<string>>;
}) => {
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { addChat, removeLastItem } = useChatBotStore();

  const handleSendTextInput = async () => {
    if (loading) return;
    setLoading(true);
    if (!token) throw new Error("Token not provided");
    if (!textValue) return;
    try {
      addChat({ answer: textValue, owner: "user" });
      addChat({ answer: "Loading", owner: "bot", loading: true });
      setTextValue("");
      const res = await sendChatText({ chat: textValue }, token);
      if (res.status === 200 && res.data.success) {
        const { data } = res.data;
        removeLastItem();
        if (data.blob) {
          const base64 = String(data.blob);
          const audioBlob = new Blob(
            [Uint8Array.from(atob(base64), c => c.charCodeAt(0))],
            { type: "audio/wav" }
          );
          addChat({
            answer: data.answer,
            owner: "bot",
            blob: audioBlob
          });
        } else {
          addChat({ answer: data.answer, owner: "bot" });
        }
        setTextValue("");
      } else {
        throw new Error(res.data.message ?? "Unknow error occured.");
      }
    } catch (e) {
      console.error(e);
      if (e instanceof AxiosError) {
        removeLastItem();
        addChat({ answer: e.message, owner: "bot", error: true });
        return;
      }
      if (e instanceof Error) {
        removeLastItem();
        addChat({ answer: e.message, owner: "bot", error: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-1 px-3 py-[9px] font-alexandria">
      <input
        type="text"
        placeholder="Type Something..."
        className="ring-none h-[43px] flex-1 rounded-[30px] border border-x-0 border-[#555555] bg-[#111111] px-5 py-[12px] font-alexandria text-[14px] outline-none focus:outline-none focus:ring-transparent xl:h-[51px] xl:text-[18px] 2xl:h-[70px] 2xl:px-6 2xl:py-4 3xl:text-[25px]"
        value={textValue}
        onChange={e => setTextValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            handleSendTextInput();
          }
        }}
      />
      <div className="ml-auto">
        {textValue ? (
          <button
            className="flex h-[43px] w-[48px] items-center justify-center rounded-[30px] border border-x-0 border-[#555555] bg-[#111111] xl:h-[51px] xl:w-[57px] 2xl:h-[70px] 2xl:w-[80px]"
            onClick={handleSendTextInput}
          >
            <SendIcon />
          </button>
        ) : (
          <button
            className="flex h-[43px] w-[48px] items-center justify-center rounded-[30px] border border-x-0 border-[#555555] bg-[#111111] xl:h-[51px] xl:w-[57px] 2xl:h-[70px] 2xl:w-[80px]"
            onClick={() => setMessageType("audio")}
          >
            <AudioIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const SendMessage = () => {
  const [messageType, setMessageType] = useState<"audio" | "text">("text");
  const [messageText, setMessageText] = useState("");

  return messageType === "text" ? (
    <TextSendMessage
      setMessageType={setMessageType}
      textValue={messageText}
      setTextValue={setMessageText}
    />
  ) : (
    <AudioSendMessage
      setMessageType={setMessageType}
      setMessageText={setMessageText}
    />
  );
};

export const ChatBotButton = ({ className }: { className?: string }) => {
  const { setOpen } = useChatBotStore();
  return (
    <button
      onClick={() => {
        setOpen(true);
      }}
      className={twMerge(
        "grid place-items-stretch rounded-[6px] bg-black p-[1px] font-alexandria 2xl:rounded-[10px]",
        className
      )}
    >
      <span className="rounded-[5px] bg-black p-1.5 2xl:rounded-[9px] 3xl:px-[0px] 3xl:pb-2 3xl:pt-0">
        <svg width="56" height="55" viewBox="0 0 56 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="path-1-inside-1_53_26" fill="white">
            <path d="M13 3.77734C5.8203 3.77734 0 9.59764 0 16.7773V33.6406C0.000161352 38.0309 2.17699 41.912 5.50977 44.2656V53.4561C5.50977 54.3116 6.51397 54.7721 7.16211 54.2139L15.9492 46.6406H40.1855C47.3651 46.6406 53.1853 40.8201 53.1855 33.6406V16.7773C53.1855 9.59764 47.3652 3.77734 40.1855 3.77734H13Z" />
          </mask>
          <path d="M0 33.6406L-2 33.6407V33.6406H0ZM5.50977 44.2656L6.66348 42.6319L7.50977 43.2296V44.2656H5.50977ZM7.16211 54.2139L8.46781 55.7288L8.46737 55.7292L7.16211 54.2139ZM15.9492 46.6406L14.6435 45.1256L15.2063 44.6406H15.9492V46.6406ZM53.1855 33.6406L55.1855 33.6406L55.1855 33.6407L53.1855 33.6406ZM13 3.77734V5.77734C6.92487 5.77734 2 10.7022 2 16.7773H0H-2C-2 8.49307 4.71573 1.77734 13 1.77734V3.77734ZM0 16.7773H2V33.6406H0H-2V16.7773H0ZM0 33.6406L2 33.6406C2.00014 37.3535 3.83838 40.6369 6.66348 42.6319L5.50977 44.2656L4.35605 45.8993C0.515591 43.1872 -1.99981 38.7083 -2 33.6407L0 33.6406ZM5.50977 44.2656H7.50977V53.4561H5.50977H3.50977V44.2656H5.50977ZM5.50977 53.4561H7.50977C7.50977 52.6015 6.50575 52.1396 5.85685 52.6985L7.16211 54.2139L8.46737 55.7292C6.52219 57.4047 3.50977 56.0217 3.50977 53.4561H5.50977ZM7.16211 54.2139L5.85641 52.6989L14.6435 45.1256L15.9492 46.6406L17.2549 48.1556L8.46781 55.7288L7.16211 54.2139ZM15.9492 46.6406V44.6406H40.1855V46.6406V48.6406H15.9492V46.6406ZM40.1855 46.6406V44.6406C46.2604 44.6406 51.1853 39.7156 51.1855 33.6406L53.1855 33.6406L55.1855 33.6407C55.1852 41.9246 48.4697 48.6406 40.1855 48.6406V46.6406ZM53.1855 33.6406H51.1855V16.7773H53.1855H55.1855V33.6406H53.1855ZM53.1855 16.7773H51.1855C51.1855 10.7022 46.2607 5.77734 40.1855 5.77734V3.77734V1.77734C48.4698 1.77734 55.1855 8.49307 55.1855 16.7773H53.1855ZM40.1855 3.77734V5.77734H13V3.77734V1.77734H40.1855V3.77734Z" fill="url(#paint0_linear_53_26)" mask="url(#path-1-inside-1_53_26)" />
          <rect width="19" height="19" transform="translate(36.8418)" fill="#050505" />
          <path d="M44.0515 4.31301C44.5249 2.92759 46.4392 2.88564 47.0005 4.18714L47.048 4.3138L47.6868 6.18214C47.8332 6.61061 48.0698 7.00271 48.3807 7.33197C48.6915 7.66123 49.0693 7.92001 49.4887 8.09084L49.6605 8.15497L51.5288 8.79305C52.9142 9.26647 52.9562 11.1807 51.6555 11.742L51.5288 11.7895L49.6605 12.4284C49.2318 12.5747 48.8396 12.8113 48.5102 13.1221C48.1808 13.4329 47.9219 13.8108 47.751 14.2302L47.6868 14.4012L47.0487 16.2703C46.5753 17.6558 44.6611 17.6977 44.1006 16.397L44.0515 16.2703L43.4134 14.402C43.2671 13.9734 43.0305 13.5811 42.7197 13.2517C42.4089 12.9223 42.031 12.6634 41.6116 12.4925L41.4406 12.4284L39.5722 11.7903C38.186 11.3169 38.1441 9.40264 39.4456 8.84214L39.5722 8.79305L41.4406 8.15497C41.8691 8.00856 42.2612 7.77196 42.5904 7.46113C42.9197 7.1503 43.1785 6.77247 43.3493 6.35313L43.4134 6.18214L44.0515 4.31301ZM45.5501 4.82443L44.912 6.69276C44.6891 7.34613 44.3264 7.94304 43.8493 8.44194C43.3721 8.94085 42.7919 9.32974 42.1491 9.58155L41.9512 9.65359L40.0829 10.2917L41.9512 10.9298C42.6046 11.1527 43.2015 11.5154 43.7004 11.9925C44.1993 12.4697 44.5882 13.0499 44.84 13.6927L44.912 13.8906L45.5501 15.7589L46.1882 13.8906C46.4111 13.2372 46.7738 12.6403 47.251 12.1414C47.7282 11.6425 48.3083 11.2536 48.9511 11.0018L49.149 10.9306L51.0174 10.2917L49.149 9.65359C48.4957 9.43065 47.8988 9.06797 47.3999 8.59081C46.901 8.11365 46.5121 7.53347 46.2602 6.89068L46.189 6.69276L45.5501 4.82443ZM51.8835 1.58334C52.0316 1.58334 52.1767 1.62489 52.3024 1.70326C52.428 1.78163 52.5292 1.89368 52.5944 2.02668L52.6324 2.1193L52.9095 2.93155L53.7225 3.20864C53.8709 3.25906 54.001 3.35241 54.0963 3.47686C54.1917 3.60131 54.2479 3.75126 54.2579 3.90769C54.2679 4.06413 54.2312 4.22001 54.1525 4.35559C54.0739 4.49117 53.9567 4.60034 53.8159 4.66926L53.7225 4.70726L52.9102 4.98434L52.6332 5.79739C52.5826 5.94577 52.4892 6.07581 52.3647 6.17105C52.2402 6.26628 52.0903 6.32241 51.9338 6.33233C51.7774 6.34225 51.6216 6.30551 51.486 6.22677C51.3505 6.14802 51.2414 6.03082 51.1725 5.89001L51.1345 5.79739L50.8575 4.98514L50.0444 4.70805C49.896 4.65763 49.7659 4.56427 49.6706 4.43982C49.5753 4.31537 49.519 4.16543 49.509 4.00899C49.499 3.85256 49.5357 3.69667 49.6144 3.5611C49.693 3.42552 49.8102 3.31635 49.951 3.24743L50.0444 3.20943L50.8567 2.93234L51.1337 2.1193C51.1871 1.96289 51.2881 1.8271 51.4226 1.73099C51.557 1.63487 51.7182 1.58324 51.8835 1.58334Z" fill="#1CCDD3" />
          <path d="M26.6885 13.5459C33.9586 13.546 39.8347 19.1422 39.835 26.0244C39.835 32.9068 33.9587 38.5038 26.6885 38.5039C19.4181 38.5039 13.542 32.9069 13.542 26.0244C13.5422 19.1421 19.4183 13.5459 26.6885 13.5459Z" stroke="white" strokeWidth="0.4" />
          <mask id="path-5-inside-2_53_26" fill="white">
            <path d="M12.0059 22.6888C12.0059 21.2146 13.2009 20.0195 14.6751 20.0195V20.0195V32.0313V32.0313C13.2009 32.0313 12.0059 30.8362 12.0059 29.362V22.6888Z" />
          </mask>
          <path d="M11.6059 22.6888C11.6059 20.9937 12.98 19.6195 14.6751 19.6195H14.6751V20.4195H14.6751C13.4219 20.4195 12.4059 21.4355 12.4059 22.6888L11.6059 22.6888ZM14.6751 32.4313H14.6751C12.98 32.4313 11.6059 31.0571 11.6059 29.362L12.4059 29.362C12.4059 30.6153 13.4219 31.6313 14.6751 31.6313H14.6751V32.4313ZM14.6751 32.4313C12.98 32.4313 11.6059 31.0571 11.6059 29.362V22.6888C11.6059 20.9937 12.98 19.6195 14.6751 19.6195L14.6751 20.4195C13.4219 20.4195 12.4059 21.4355 12.4059 22.6888V29.362C12.4059 30.6153 13.4219 31.6313 14.6751 31.6313L14.6751 32.4313ZM14.6751 20.0195V32.0313V20.0195Z" fill="white" mask="url(#path-5-inside-2_53_26)" />
          <mask id="path-7-inside-3_53_26" fill="white">
            <path d="M41.373 22.6888C41.373 21.2146 40.178 20.0195 38.7038 20.0195V20.0195V32.0313V32.0313C40.178 32.0313 41.373 30.8362 41.373 29.362V22.6888Z" />
          </mask>
          <path d="M41.773 22.6888C41.773 20.9937 40.3989 19.6195 38.7038 19.6195H38.7038V20.4195H38.7038C39.9571 20.4195 40.973 21.4355 40.973 22.6888L41.773 22.6888ZM38.7038 32.4313H38.7038C40.3989 32.4313 41.773 31.0571 41.773 29.362L40.973 29.362C40.973 30.6153 39.9571 31.6313 38.7038 31.6313H38.7038V32.4313ZM38.7038 32.4313C40.3989 32.4313 41.773 31.0571 41.773 29.362V22.6888C41.773 20.9937 40.3989 19.6195 38.7038 19.6195L38.7038 20.4195C39.9571 20.4195 40.973 21.4355 40.973 22.6888V29.362C40.973 30.6153 39.9571 31.6313 38.7038 31.6313L38.7038 32.4313ZM38.7038 20.0195V32.0313V20.0195Z" fill="white" mask="url(#path-7-inside-3_53_26)" />
          <circle cx="32.0267" cy="24.0228" r="2.16928" fill="white" stroke="#51B8C8" />
          <path d="M23.8338 30.1906C23.4278 30.3083 23.2615 30.7844 23.589 31.0516C23.836 31.2532 24.1272 31.4306 24.4545 31.5774C25.0881 31.8615 25.8304 32.019 26.5939 32.0312C27.3573 32.0433 28.1101 31.9097 28.7633 31.646C29.1048 31.5081 29.4116 31.3378 29.675 31.1413C30.0123 30.8896 29.8687 30.4075 29.4689 30.276V30.276C29.2157 30.1929 28.9421 30.2884 28.7372 30.4586C28.5459 30.6175 28.3135 30.7536 28.0496 30.8601C27.6212 31.0331 27.1275 31.1208 26.6268 31.1128C26.1261 31.1048 25.6392 31.0015 25.2237 30.8152C24.9776 30.7048 24.7626 30.568 24.5867 30.4112C24.38 30.227 24.0997 30.1135 23.8338 30.1906V30.1906Z" fill="#0FD4D7" />
          <circle cx="21.3548" cy="24.0228" r="2.16928" fill="white" stroke="#51B8C8" />
          <defs>
            <linearGradient id="paint0_linear_53_26" x1="45.498" y1="9.99807" x2="3.61504" y2="57.6011" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1CCDD3" />
              <stop offset="0.586538" stopColor="white" />
            </linearGradient>
          </defs>
        </svg>

      </span>
    </button>
  );
};

const ChatBot = () => {
  const { open, setOpen } = useChatBotStore();
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="invisible">
          <button className="fixed bottom-8 right-6">
            <ChatBotIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[350px] rounded-[25px] bg-black/90 p-0 backdrop-blur-sm xl:w-[396px] 3xl:w-[490px]"
          align="end"
        >
          <div className="relative grid w-full grid-rows-[min_auto_min] rounded-[25px] border-2 border-[#555555]">
            <div className="flex gap-3 p-2 2xl:gap-6 2xl:p-4">
              <PopoverClose asChild>
                <X className="ml-auto" />
              </PopoverClose>
            </div>
            <ChatBody />
            <SendMessage />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2">
              <Image
                src={chatBotImage}
                alt="chat bot image"
                className="h-[143px] w-[143px] object-cover xl:h-[169px] xl:w-[169px] 2xl:h-[230px] 2xl:w-[230px]"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />}
    </>
  );
};

export default ChatBot;
