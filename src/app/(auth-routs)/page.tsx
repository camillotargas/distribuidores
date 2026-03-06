"use client"

import React, { useRef, useState, useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Card } from 'primereact/card'
import { Checkbox } from "primereact/checkbox"
import { Messages } from 'primereact/messages'

import { InputSwitch } from "primereact/inputswitch"
import { PrimeReactContext } from 'primereact/api'

import { loginSchema, loginType } from "@/types/sistema/acesso_sistema"
import { acesso, getCookiesLogin, setCookieCreditial, setCookieToken } from "@/actions/sistema/acesso_sistema"

import Loading from '@/components/loading'
import { InputMask } from 'primereact/inputmask'
import uData from '@/utils/uData'

export default function AcessoSistema() {

  const messages = useRef<Messages>(null)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const [dados, setDados] = useState<loginType>({ cliente: '', usuario: '', senha: '', lembrarMe: false });
  const offSet = uData.consultaOffSet()

  // const [checked, setChecked] = useState(false)
  // const { changeTheme } = useContext(PrimeReactContext)

  // const onThemeSwitchChange = (e: any) => {
  //   if (e.value) {

  //     if (changeTheme) {
  //       changeTheme("saga-green", "arya-green", "theme-link", () => setChecked(true))
  //     }

  //   } else {

  //     if (changeTheme) {
  //       changeTheme("arya-green", "saga-green", 'theme-link', () => setChecked(false))
  //     }

  //   }
  // }

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<loginType>({
    // defaultValues: async () => getCookiesLogin(),
    defaultValues: dados,
    values: dados,
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(dados: loginType) {

    // alert(dados.senha)

    setIsLoading(true)
    const retorno = await acesso(dados, offSet)

    if (retorno.erro !== '') {
      // alert(retorno.erro)
      setIsLoading(false)
      messages.current?.clear()
      messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro:', detail: retorno.erro, closable: false });

    } else {
      messages.current?.clear()
      // alert(retorno.token)
      await setCookieToken(retorno.token || '')
      await setCookieCreditial(dados.cliente, dados.usuario, dados.lembrarMe)
      setIsLoading(false)
      router.replace('/admin')
    }
    // reset();
  }

  useEffect(() => {

    async function buscaCookies() {

      const cookiesLogin = await getCookiesLogin()

      setValue('cliente', cookiesLogin.cliente)
      setValue('usuario', cookiesLogin.usuario)
      setValue('senha', '')
      setValue('lembrarMe', cookiesLogin.lembrarMe)

    }

    buscaCookies()

  }, [])

  return (

    <div className="flex flex-col items-center justify-center h-full">

      <div className="w-full">
        <Messages ref={messages} className="mx-3" />
      </div>

      <Card title="Acesso ao Sistema" className="md:w-80">

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 gap-4">

            <div className="flex flex-col">
              <Controller
                name="cliente"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name}>Cliente</label>
                    <InputMask
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      mask="99.999.999/9999-99"
                      placeholder="Informe seu CNPJ"
                      autoFocus
                    />
                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col">
              <Controller
                name="usuario"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name}>Usuário</label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Informe seu usuário"
                    />
                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col">
              <Controller
                name="senha"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name}>Senha</label>
                    <Password
                      id={field.name}
                      value={field.value}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => field.onChange(e.target.value)}
                      feedback={false}
                      inputStyle={{ width: "100%" }} style={{ width: "100%" }}
                      placeholder="Informe sua senha"
                    />
                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col">
              Lembrar-me
              <Controller
                name="lembrarMe"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      inputId={field.name}
                      checked={field.value}
                      inputRef={field.ref}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      onChange={(e) => field.onChange(e.checked)} />
                  </>
                )}
              />
            </div>

            <div className="flex flex-col">
              <Button label="Entrar" type="submit" icon="pi pi-check" className="mt-2" />
            </div>

            {/* <div className="flex flex-col">
              <InputSwitch checked={checked} onChange={(e) => onThemeSwitchChange(e)} />
            </div> */}

          </div>

        </form>

      </Card>

      {
        isLoading && <Loading />
      }

    </div>

  )
}