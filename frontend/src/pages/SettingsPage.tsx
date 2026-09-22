import { useThemeStore } from '../store/useThemeStore'
import { SegmentedControl, SegmentedOption } from '../styles/shared'
import { Page, Card, TitleRow, Title, Desc, Field, FieldLabel } from './SettingsPage.styles'

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
