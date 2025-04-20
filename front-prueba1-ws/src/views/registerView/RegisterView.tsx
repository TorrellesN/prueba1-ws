import React from 'react'
import { RegisterFormZod } from './RegisterFormZod';

export default function RegisterView() {
    return (
        <main className=" ">
          <div className="container flex-1 py-4 md:py-8">
            <RegisterFormZod />
          </div>
        </main>
      );
}
