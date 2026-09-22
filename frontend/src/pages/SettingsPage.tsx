import styled from 'styled-components'
import { useThemeStore } from '../store/useThemeStore'
import { GlassCard, SegmentedControl, SegmentedOption, glass } from '../styles/shared'

const Page = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`

const Card = styled(GlassCard)`
  width: 100%;
  max-width: 560px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${glass(38)}
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Title = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

const Desc = styled.div`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FieldLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.06em;
`

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <Page>
      <Card>
        <TitleRow>
          <Title>설정</Title>
          <Desc>화면 표시 방식을 바꿀 수 있습니다.</Desc>
        </TitleRow>

        <Field>
          <FieldLabel>테마</FieldLabel>
          <SegmentedControl>
            <SegmentedOption $active={theme === 'light'} onClick={() => theme !== 'light' && toggleTheme()}>
              라이트
            </SegmentedOption>
            <SegmentedOption $active={theme === 'dark'} onClick={() => theme !== 'dark' && toggleTheme()}>
              다크
            </SegmentedOption>
          </SegmentedControl>
        </Field>
      </Card>
    </Page>
  )
}
