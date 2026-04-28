import { modelosSchema, modelosType } from '@/types/veiculos/marcas_modelos'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputNumber } from 'primereact/inputnumber'
import { classNames } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { codigoNomeType } from '@/types/sistema/codigoNome'
import { Dropdown } from 'primereact/dropdown'

export default function FrmOpcoes(props: any) {

    const [dados, setDados] = useState<modelosType>(props.dadosEnvio)

    const refFoco = useRef<any>(null)

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<modelosType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(modelosSchema)
    })

    const codigoNomeStatus: codigoNomeType[] = [
        { codigo: 'A', nome: 'Ativo' },
        { codigo: 'I', nome: 'Inativo' },
    ]

    function handleGrava() {
        setValue('flagInsertUpdate', true)
        // console.log('opcoesSchema.parse: ', opcoesSchema.parse(dados))
        handleSubmit(onSubmit)()
    }

    function handleVolta() {
        props.dadosRetorno()
    }

    function onSubmit(dados: modelosType) {
        props.dadosRetorno(dados)
    }

    useEffect(() => {
        setTimeout(() => {
            refFoco.current?.focus()
        }, 0)
    }, [])

    return (
        <>
            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className='flex flex-col'>
                        <Controller
                            name='id'
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>ID</label>
                                    <InputNumber
                                        id={field.name}
                                        inputRef={field.ref}
                                        value={field.value}
                                        onBlur={field.onBlur}
                                        onValueChange={(e) => field.onChange(e)}
                                        useGrouping={false}
                                        inputClassName={classNames({ 'p-invalid': fieldState.error })}
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className='flex flex-col'>
                        <Controller
                            name='nome'
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Nome</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        maxLength={60}
                                        ref={refFoco}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Status</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="codigo"
                                        options={codigoNomeStatus}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    // disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                </div>

            </form>

            <Divider />

            <div className="flex justify-center mt-2 mb-2 gap-2">

                <Button label="Gravar" type="button" icon="pi pi-check" onClick={handleGrava} />
                <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={handleVolta} />

            </div >

        </>
    )
}