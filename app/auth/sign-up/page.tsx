import { SignUpForm } from '@/components/sign-up-form'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="flex flex-1 w-full items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-sm min-w-0">
          <SignUpForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
