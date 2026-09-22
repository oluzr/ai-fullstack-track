import { Page, Card, Title, Desc } from './ComingSoonPage.styles'

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <Page>
      <Card>
        <Title>{title}</Title>
        <Desc>이 기능은 아직 준비 중입니다.</Desc>
      </Card>
    </Page>
  )
}
