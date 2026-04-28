import { direitosType, direitosSchema } from '@/types/basico/perfis_usuarios_sistema'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputNumber } from 'primereact/inputnumber'
import { classNames } from 'primereact/utils'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { comboBoxType } from '@/types/sistema/combobox'
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { getComboBoxModulos, getComboBoxOpcoes } from '@/actions/sistema/modulos_opcoes'
import { idNomeType } from '@/types/sistema/idNome'
import { Messages } from 'primereact/messages'

export default function FrmOpcoes(props: any) {

    const [dados, setDados] = useState<any>(props.dadosEnvio)
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const [dadosGerais, setDadosGerais] = useState<any>(props.dadosGerais)

    // autocompletar
    const [listaModulos, setListaModulos] = useState<comboBoxType[]>([])
    const [moduloSelecionado, setModuloSelecionado] = useState<comboBoxType>({} as comboBoxType)

    const [listaOpcoes, setListaOpcoes] = useState<comboBoxType[]>([])
    const [opcaoSelecionada, setOpcaoSelecionada] = useState<comboBoxType>({} as comboBoxType)

    const refFoco = useRef<any>(null)

    const messages = useRef<Messages>(null)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<direitosType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(direitosSchema)
    })

    const idNomeDireito: idNomeType[] = [
        { id: 1, nome: '1-Leitura' },
        { id: 2, nome: '2-Leitura/Gravação' },
    ]

    function handleGrava() {

        setValue('flagInsertUpdate', true)
        setValue('flagDelete', false)

        if (dadosGerais.tbaDireitoPerfilUsuarioSistema) {

            let lContador = 0
            for (let i = 0; i < dadosGerais.tbaDireitoPerfilUsuarioSistema.length; i++) {

                if (dadosGerais.tbaDireitoPerfilUsuarioSistema[i].id !== getValues('id')) {

                    if (
                        (dadosGerais.tbaDireitoPerfilUsuarioSistema[i].perfilUsuarioSistemaId == getValues('perfilUsuarioSistemaId')) &&
                        (dadosGerais.tbaDireitoPerfilUsuarioSistema[i].moduloId == getValues('moduloId')) &&
                        (dadosGerais.tbaDireitoPerfilUsuarioSistema[i].opcaoId == getValues('opcaoId'))
                    ) {
                        lContador++
                    }

                }
            }

            if (lContador) {
                messages.current?.clear();
                messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: 'Registro repetido.', closable: false });
                return
            }

        }

        handleSubmit(onSubmit)()
    }

    function handleVolta() {
        props.dadosRetorno()
    }

    // function onSubmit(dados: direitosType) {
    function onSubmit(dados: any) {
        // console.log('onSubmit dados: ', dados)
        props.dadosRetorno(dados)
    }

    // autocompletar
    const buscaModulos = async (event: AutoCompleteCompleteEvent) => {
        setListaModulos((await getComboBoxModulos(0, event.query)))
    }

    const buscaOpcoes = async (event: AutoCompleteCompleteEvent) => {
        setListaOpcoes((await getComboBoxOpcoes(0, event.query, getValues('moduloId'))))
    }

    // autocompletar
    async function preencheComboBox() {
        setIsLoading(true)
        setModuloSelecionado((await getComboBoxModulos(getValues('moduloId'), ''))[0])
        setOpcaoSelecionada((await getComboBoxOpcoes(getValues('opcaoId'), '', getValues('moduloId')))[0])
        setIsLoading(false)
    }

    // autocompletar
    useEffect(() => {
        preencheComboBox()
    }, [dados])

    useEffect(() => {
        setTimeout(() => {
            refFoco.current?.focus()
        }, 0)
        // console.log('useEffect dados: ', dados)
    }, [])

    return (
        <>

            <Messages ref={messages} />

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

                    <div className="flex flex-col">
                        <Controller
                            name="moduloId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Módulo</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={moduloSelecionado}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaModulos}
                                        completeMethod={buscaModulos}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setModuloSelecionado(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('moduloId', moduloSelecionado?.id)
                                            setValue('moduloNome', moduloSelecionado?.nome)
                                            if (getValues('moduloId')) {
                                                trigger(['moduloId'])
                                            }
                                        }}
                                        dropdown
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="opcaoId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Opção</label>
                                    <AutoComplete
                                        id={field.name}
                                        value={opcaoSelecionada}
                                        field='nome'
                                        inputId='id'
                                        suggestions={listaOpcoes}
                                        completeMethod={buscaOpcoes}
                                        onChange={(e: AutoCompleteChangeEvent) => {
                                            setOpcaoSelecionada(e.value)
                                        }}
                                        onBlur={() => {
                                            setValue('opcaoId', opcaoSelecionada?.id)
                                            setValue('opcaoNome', opcaoSelecionada?.nome)
                                            if (getValues('opcaoId')) {
                                                trigger(['opcaoId'])
                                            }
                                        }}
                                        dropdown
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="direito"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Direito</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="id"
                                        options={idNomeDireito}
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

                    {/* <div className="flex flex-col">
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
                    </div> */}

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
