'use client'

import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'

import { Input } from '../../components/inputs/Input'
import { Button } from '@/app/components/Button'
import { AuthSocialButton } from './AuthSocialButton'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'

type Variant = 'LOGIN' | 'REGISTER'

export function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .catch(() => toast.error('Algo deu errado'))
        .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback: any) => {
          if (callback?.error) {
            toast.error('Email ou senha incorretos')
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Sucesso')
          }
        })
        .finally(() => setIsLoading(false))
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, { redirect: false })
      .then((callback: any) => {
        if (callback?.error) {
          toast.error('Credencial inválida')
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Sucesso')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Nome"
              disabled={isLoading}
              register={register}
              errors={errors}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            disabled={isLoading}
            register={register}
            errors={errors}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Logar' : 'Registrar'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN' ? 'Novo no messenger?' : 'Já tem uma conta?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Criar uma conta' : 'Logar'}
          </div>
        </div>
      </div>
    </div>
  )
}
