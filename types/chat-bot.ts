export type ChatBot = ChatBotAudio | ChatBotText;

export type ChatBotAudio = {
  answer?: string;
  transcription?: string;
  owner: "user" | "bot";
  error?: boolean;
  loading?: boolean;
  blob?: Blob; // Base64
};
export type ChatBotText = {
  answer?: string;
  owner: "user" | "bot";
  error?: boolean;
  loading?: boolean;
  blob?: Blob; // Base64
};

export type ChatBotAudioToText = {
  transcription: string;
};
