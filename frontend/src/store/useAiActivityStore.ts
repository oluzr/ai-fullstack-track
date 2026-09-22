import { create } from 'zustand'
import type { RobotPhase } from '../components/LLMModel'

// 앱 어디선가 LLM을 호출 중이라는 걸 사이드바의 로봇 마스코트가 알 수 있도록 하는 전역 상태.
// 각 페이지의 useMutation이 onMutate/onSuccess/onError에서 flashAiPhase를 호출해 갱신한다.
type AiActivityStore = {
  phase: RobotPhase
  setPhase: (phase: RobotPhase) => void
}

export const useAiActivityStore = create<AiActivityStore>((set) => ({
  phase: 'idle',
  setPhase: (phase) => set({ phase }),
}))

let holdTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 로봇 상태를 즉시 바꾸고, done/error처럼 "결과를 보여주는" 상태는 잠깐 유지했다가
 * 자동으로 idle로 되돌린다. thinking/tool은 호출이 끝날 때 다른 phase로 다시
 * 불러줄 것이므로 별도 타이머 없이 계속 유지된다.
 */
export function flashAiPhase(phase: RobotPhase, holdMs = 1600) {
  clearTimeout(holdTimer)
  useAiActivityStore.getState().setPhase(phase)
  if (phase === 'done' || phase === 'error') {
    holdTimer = setTimeout(() => useAiActivityStore.getState().setPhase('idle'), holdMs)
  }
}
