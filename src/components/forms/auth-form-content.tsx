'use client'

import SignUpForm from './signup-form'

function AuthFormContent (): React.ReactNode {
  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Please enter your credentials to continue.</p>
      <SignUpForm />
    </div>
  )
}

export default AuthFormContent
