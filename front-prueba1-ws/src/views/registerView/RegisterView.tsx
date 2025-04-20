import React from 'react'
import { RegisterForm } from './RegisterForm';

export default function RegisterView() {
    return (
        <main className=" ">
          <div className="container flex-1 py-4 md:py-8">
            <RegisterForm />
          </div>
        </main>
      );
}
