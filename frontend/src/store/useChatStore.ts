import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 채팅 패널은 닫히면 언마운트되므로, 이어 붙일 대화 id와 열림 여부는 패널 바깥에 둔다.
// sessionId만 localStorage에 남겨서 새로고침 뒤에도 마지막 대화를 이어갈 수 있게 한다.
type ChatStore = {
  isOpen: boolean
  sessionId: number | null
  toggle: () => void
  close: () => void
  setSessionId: (sessionId: number | null) => void
  /** 채팅 내역의 대화를 패널에 불러와 이어서 대화한다. */
  continueSession: (sessionId: number) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      isOpen: false,
      sessionId: null,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      close: () => set({ isOpen: false }),
      setSessionId: (sessionId) => set({ sessionId }),
      continueSession: (sessionId) => set({ sessionId, isOpen: true }),
    }),
    { name: 'chat-storage', partialize: (state) => ({ sessionId: state.sessionId }) },
  ),
)
