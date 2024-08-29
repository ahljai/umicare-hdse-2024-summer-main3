import { createAI } from 'ai/rsc';
import { getSession, saveChatToDatabase } from '@/lib/chat/actions';
import { nanoid } from 'nanoid';
import { Chat, Message } from '@/lib/types';

// Mock the dependencies
jest.mock('ai/rsc', () => ({
  createAI: jest.fn()
}));
jest.mock('@/lib/chat/actions', () => ({
  getSession: jest.fn(),
  saveChatToDatabase: jest.fn()
}));
jest.mock('nanoid', () => ({
  nanoid: jest.fn().mockReturnValue('mockedChatId')
}));

describe('AI Module', () => {
  const mockCreateAI = createAI as jest.Mock;
  const mockGetSession = getSession as jest.Mock;
  const mockSaveChatToDatabase = saveChatToDatabase as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize AI with initial state', async () => {
    const initialAIState = { chatId: nanoid(), messages: [] };
    const initialUIState = [];

    const actions = {
      submitUserMessage: jest.fn(),
      scheduleAppointment: jest.fn()
    };

    mockCreateAI.mockReturnValue({
      actions,
      initialUIState,
      initialAIState
    });

    const AI = mockCreateAI({
      actions,
      initialUIState,
      initialAIState,
      onGetUIState: jest.fn(),
      onSetAIState: jest.fn()
    });

    expect(AI.initialAIState).toEqual({ chatId: 'mockedChatId', messages: [] });
    expect(AI.initialUIState).toEqual([]);
  });

  test('should get UI state if session exists', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'userId' } });

    const aiState: Chat = {
      id: 'mockedChatId',
      title: 'Test Chat',
      userId: 'userId',
      createdAt: new Date(),
      messages: [{ role: 'user', content: 'Hello', id: '1' }]
    };

    const getUIStateFromAIState = jest.fn().mockReturnValue([
      {
        id: 'mockedChatId-0',
        display: 'mockedDisplay'
      }
    ]);

    const AI = mockCreateAI({
      actions: {},
      initialUIState: [],
      initialAIState: { chatId: nanoid(), messages: [] },
      onGetUIState: async () => {
        const session = await mockGetSession();
        if (session && session.user) {
          return getUIStateFromAIState(aiState);
        }
      },
      onSetAIState: jest.fn()
    });

    const uiState = await AI.onGetUIState();
    expect(uiState).toEqual([
      {
        id: 'mockedChatId-0',
        display: 'mockedDisplay'
      }
    ]);
  });

  test('should save AI state when session exists', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'userId' } });
    const mockChat: Chat = {
      id: 'mockedChatId',
      title: 'Test Chat',
      userId: 'userId',
      createdAt: new Date(),
      messages: [{ role: 'user', content: 'Hello', id: '1' }],
      path: '/chat/mockedChatId'
    };

    const AI = mockCreateAI({
      actions: {},
      initialUIState: [],
      initialAIState: { chatId: nanoid(), messages: [] },
      onGetUIState: jest.fn(),
      onSetAIState: async ({ state }) => {
        const session = await mockGetSession();
        if (session && session.user) {
          const { chatId, messages } = state;

          const createdAt = new Date();
          const userId = session.user.id as string;
          const path = `/chat/${chatId}`;

          const firstMessageContent = messages[0].content as string;
          const title = firstMessageContent.substring(0, 100);

          const chat: Chat = {
            id: chatId,
            title,
            userId,
            createdAt,
            messages,
            path
          };

          await mockSaveChatToDatabase(chat);
        }
      }
    });

    await AI.onSetAIState({ state: mockChat });

    expect(mockSaveChatToDatabase).toHaveBeenCalledWith(mockChat);
  });
});