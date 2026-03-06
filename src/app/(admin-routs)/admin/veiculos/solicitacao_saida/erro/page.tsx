"use client"

import { useRouter } from 'next/navigation'
import { Button } from "primereact/button"

export default function Erro() {

  const router = useRouter()

  function handleInicio() {
    router.push('/admin')
  }

  return (

    <div className="flex flex-col items-center justify-center h-full">

      <div className="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
        <div className="text-surface-700 dark:text-surface-100 text-center flex flex-col items-center gap-4">
          <i className="pi pi-times" style={{ color: 'red', fontSize: '3rem' }}></i>
          <div className="text-surface-900 dark:text-surface-0 font-bold text-4xl leading-tight">Você possui uma solicitação pendente.</div>
          <div className="text-surface-700 dark:text-surface-100 text-xl leading-normal">Uma nova solicitação só pode ser feita quando a pendente for concluída.</div>
          <Button label="Início" type="button" icon="pi pi-home" onClick={handleInicio} />
        </div>
      </div>

    </div>

  )
}