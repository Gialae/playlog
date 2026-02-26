'use client'
import dynamic from 'next/dynamic'

const GlobalChat = dynamic(() => import('./GlobalChat'), { ssr: false })

export default function ChatWrapper() {
  return (
    <div style={{position:'fixed', bottom:'24px', right:'24px', zIndex:9999}}>
      <GlobalChat />
    </div>
  )
}