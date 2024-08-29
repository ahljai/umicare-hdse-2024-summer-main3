'use server';

import { getSession as nextAuthGetSession } from 'next-auth/react';
import { saveChat } from '@/app/actions';
import { Chat } from '@/lib/types';

export async function getSession() {
  try {
    return await nextAuthGetSession();
  } catch (error) {
    console.error('Failed to get session:', error);
    throw error;
  }
}

export async function saveChatToDatabase(chat: Chat) {
  try {
    await saveChat(chat);
  } catch (error) {
    console.error('Failed to save chat to database:', error);
    throw error;
  }
}