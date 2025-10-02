import { useState } from 'react'

interface Credentials {
  email: string
  password: string
}

function SignUpForm (): React.ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' })
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <label>
          Email:
          <input type='email' name='email' />
        </label>
        <label>
          Password:
          <input type='password' name='password' />
        </label>
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm
