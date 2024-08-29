const { createAI, createStreamableUI, getMutableAIState, getAIState, streamUI, createStreamableValue } = require('ai/rsc');
console.log(createAI);
const { openai } = require('@ai-sdk/openai');
const { spinner, BotCard, BotMessage, SystemMessage, MedicalInfoCard, AppointmentScheduler } = require('@/components/healthcare');
const { z } = require('zod');
const { EventsSkeleton } = require('@/components/healthcare/events-skeleton');
const { formatNumber, runAsyncFnWithoutBlocking, sleep, nanoid } = require('@/lib/utils');
const { SpinnerMessage, UserMessage } = require('@/components/healthcare/message');
const { Chat, Message } = require('@/lib/types');
const { getSession, saveChatToDatabase } = require('./serverActions');  // 引入服务端函数

async function scheduleAppointment(date, doctor) {
  const aiState = getMutableAIState(typeof AI);

  const scheduling = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Scheduling appointment with Dr. {doctor} on {date}...
      </p>
    </div>
  );

  const systemMessage = createStreamableUI(null);

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000);

    scheduling.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Scheduling appointment with Dr. {doctor} on {date}... working on it...
        </p>
      </div>
    );

    await sleep(1000);

    scheduling.done(
      <div>
        <p className="mb-2">
          Your appointment with Dr. {doctor} on {date} has been successfully scheduled.
        </p>
      </div>
    );

    systemMessage.done(
      <SystemMessage>
        You have scheduled an appointment with Dr. {doctor} on {date}.
      </SystemMessage>
    );

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has scheduled an appointment with Dr. ${doctor} on ${date}]`
        }
      ]
    });
  });

  return {
    schedulingUI: scheduling.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  };
}

async function submitUserMessage(content) {
  const aiState = getMutableAIState(typeof AI);

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  });

  let textStream;
  let textNode;

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    initial: <SpinnerMessage />,
    system: `\
    You are an AI assistant at Umi Care, helping patients with healthcare-related questions.
    You can provide medical advice, assist with scheduling appointments, and help with other healthcare queries.
    
    Messages inside [] indicate a UI element or user event. For example:
    - "[Scheduled an appointment with Dr. Smith]" indicates that an appointment has been scheduled with Dr. Smith.
    
    If the user requests medical advice, call \`provide_medical_advice\` to respond with relevant information.
    If the user wants to schedule an appointment, call \`schedule_appointment_ui\`.
    
    Besides that, you can also chat with users and help them with their healthcare needs.`,
    messages: [
      ...aiState.get().messages.map(message => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    tools: {
      provideMedicalAdvice: {
        description: 'Provide medical advice based on the user’s query.',
        parameters: z.object({
          condition: z.string().describe('The medical condition or symptom described by the user.'),
          advice: z.string().describe('The medical advice or information provided by the AI.')
        }),
        generate: async function* ({ condition, advice }) {
          yield (
            <BotCard>
              <MedicalInfoCard condition={condition} advice={advice} />
            </BotCard>
          );
        }
      },
      scheduleAppointmentUI: {
        description: 'Show UI to schedule a medical appointment.',
        parameters: z.object({
          date: z.string().describe('The date for the appointment.'),
          doctor: z.string().describe('The name of the doctor.')
        }),
        generate: async function* ({ date, doctor }) {
          yield (
            <BotCard>
              <AppointmentScheduler date={date} doctor={doctor} />
            </BotCard>
          );
        }
      }
    }
  });

  return {
    id: nanoid(),
    display: result.value
  };
}

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI({
  actions: {
    submitUserMessage,
    scheduleAppointment
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    const session = await getSession();  // 使用服务端函数

    if (session && session.user) {
      const aiState = getAIState();

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    const session = await getSession();  // 使用服务端函数

    if (session && session.user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = session.user.id;
      const path = `/chat/${chatId}`;

      const firstMessageContent = messages[0].content;
      const title = firstMessageContent.substring(0, 100);

      const chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      };

      await saveChatToDatabase(chat);  // 使用服务端函数
    } else {
      return;
    }
  }
});

export const getUIStateFromAIState = aiState => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'provideMedicalAdvice' ? (
              <BotCard>
                <MedicalInfoCard condition={tool.result.condition} advice={tool.result.advice} />
              </BotCard>
            ) : tool.toolName === 'scheduleAppointmentUI' ? (
              <BotCard>
                <AppointmentScheduler date={tool.result.date} doctor={tool.result.doctor} />
              </BotCard>
            ) : null;
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }));
};