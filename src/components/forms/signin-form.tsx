'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '../input'
import Button from '../button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignInForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/app'
    }, {
      onRequest: (ctx) => {
        console.log('Signing in...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed in:', ctx)
        setIsLoading(false)

        // Redirection explicite vers l'application
        router.push('/app')
        router.refresh() // Rafraîchir pour charger la session
      },
      onError: (ctx) => {
        console.error('Sign in error:', ctx)
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          🔐 Connexion
        </h2>
        <p className='text-gray-600 text-sm'>
          Retrouvez vos petits compagnons ! 👾
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-4' onSubmit={handleSubmit}>
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text: string) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
        />
        <Button
          type='submit'
          size='lg'
          disabled={isLoading}
          variant='primary'
        >
          {isLoading ? '🔄 Connexion...' : '🎮 Se connecter'}
        </Button>
      </form>
    </div>
  )
}

export default SignInForm
