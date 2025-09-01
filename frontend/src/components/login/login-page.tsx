import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
            <span className="text-4xl font-semibold dm-mono">MotionQ</span>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
