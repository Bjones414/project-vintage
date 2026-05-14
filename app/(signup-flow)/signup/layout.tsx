import { SimpleUnauthHeader } from '@/components/chrome/SimpleUnauthHeader'

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <SimpleUnauthHeader />
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-[480px] px-8 pb-20 pt-24">
          {children}
        </div>
      </div>
    </div>
  )
}
