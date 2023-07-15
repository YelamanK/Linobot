/// <reference types="vite/client" />
import './App.css'
import {
  AssemblyAITranscriberConfig,
  DeepgramTranscriberConfig,
  AzureSynthesizerConfig,
  VocodeConfig,
  ChatGPTAgentConfig,
  useConversation,
  PlayHtSynthesizerConfig,
  AudioDeviceConfig,
  ConversationConfig,
  ElevenLabsSynthesizerConfig
} from "vocode";
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  extendTheme,
  Heading,
  Select,
  VStack,
  ChakraProvider,
  Image,
  Flex,
  Text,
  HStack,
  Spacer
} from '@chakra-ui/react';
// @ts-ignore
import { ReactGithubStars } from 'react-github-stars';

import { BiMicrophoneOff, BiMicrophone } from "react-icons/bi";

const transcriberConfig: Omit<
  AssemblyAITranscriberConfig,
  "samplingRate" | "audioEncoding"
> = {
  type: "transcriber_assembly_ai",
  chunkSize: 6400,
};
type VoiceIdConfig = {
  [key: string]: any
};
const voiceIdConfig: Record<string, any> = {
  "Jared": import.meta.env.VITE_JARED_VOICE_ID,
  "Aaron": import.meta.env.VITE_AARON_VOICE_ID,
  "Pete": import.meta.env.VITE_PETE_VOICE_ID,
  "Dalton": import.meta.env.VITE_DALTON_VOICE_ID,
  "Umur": import.meta.env.VITE_UMUR_VOICE_ID,
}

const azureSynthesizerConfig: Omit<AzureSynthesizerConfig, "samplingRate" | "audioEncoding"> = {
  type: "synthesizer_azure",
  shouldEncodeAsWav: true,
  voiceName: "en-US-SaraNeural"
};

const defaultSynthesizerConfig: Omit<ElevenLabsSynthesizerConfig, "samplingRate" | "audioEncoding"> = {
  type: "synthesizer_eleven_labs",
  shouldEncodeAsWav: true,
  voiceId: "Bella"
};

const agentConfig: ChatGPTAgentConfig = {
  type: "agent_chat_gpt",
  initialMessage: { type: "message_base", text: "Hi! I am Luna, I am here to help you improve your Spoken English skills. Whether you're looking to practice conversations, work on pronunciation, or learn new vocabulary, I'm here to assist you. Are you ready to have a fun chat?" },
  promptPreamble:
    "You are an English tutor. Have a pleasant conversation, make jokes, be cool. ",
  generateResponses: false,
  model_name: "gpt-4-0306",
  allow_agent_to_be_cut_off: true,
  end_conversation_on_goodbye: true,
  sendFillerAudio: {
    useTypingNoise: true
  }
};
const vocodeConfig: VocodeConfig = {
  apiKey: import.meta.env.VITE_VOCODE_API_KEY,
  baseUrl: import.meta.env.VITE_VOCODE_BASE_URL
};


function ConversationButton(props: { config: ConversationConfig }) {
  const { status, start, stop, error, analyserNode } = useConversation(props.config);

  return <VStack><Button
    bgColor={"green.400"}
    color={"white"}
    disabled={["connecting"].includes(status)}
    onClick={status === "connected" ? stop : start}
  >
    {status === "connected" ? "Stop chat" : "Start a chat"}
  </Button>{status === "connected" && <Text>Listening...</Text>}</VStack>;
}

export default function App() {

  const [interviewer, setInterviewer] = useState('Anon (Faster)');
  const [audioDeviceConfig, setAudioDeviceConfig] =
    useState<AudioDeviceConfig>({});

  const shouldUseAzure = !Object.keys(voiceIdConfig).includes(interviewer);

  const localAgentConfig = shouldUseAzure ? { ...agentConfig, sendFillerAudio: false } : agentConfig;
  const localSynthesizerConfig = shouldUseAzure ? azureSynthesizerConfig : { ...defaultSynthesizerConfig, voiceId: voiceIdConfig[interviewer] };

  return (
    <Flex direction="column" width="100wh" height="100vh">
      <VStack flex={1} justify={"center"}>
        <Heading color={"white"}>
          Linobot
        </Heading>
        
        <HStack>
          

        </HStack>

      
        //<Image height={50} src="" />
        <ConversationButton config={{
          transcriberConfig,
          agentConfig: localAgentConfig,
          synthesizerConfig: localSynthesizerConfig,
          audioDeviceConfig,
          vocodeConfig
        }} />
        
//      </VStack>
      <Flex height="20%" align={"center"} justify={"center"}>
        <VStack>
          <Text></Text>
          <Box
            as="a"
            href="https://github.com/vocodedev/vocode-python"
            target="_blank"
            rel="noopener noreferrer"
            cursor="pointer"
            _hover={{
              opacity: 0.7
            }}
          >
            <VStack>
              <HStack>

              </HStack>
              <HStack>
                
                
              </HStack>

              <Text fontSize={"s"}></Text>
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Flex >
  )
}
