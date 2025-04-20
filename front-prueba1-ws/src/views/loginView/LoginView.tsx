import { LoginForm } from './LoginFormZod';

export default function LoginView() {
    return (
        <main className=" ">
          <div className="container flex-1 py-4 md:py-8">
            <LoginForm />
          </div>
        </main>
      );
}
