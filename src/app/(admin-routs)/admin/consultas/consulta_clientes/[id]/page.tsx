'use client'

import { Controller, useForm } from 'react-hook-form'
import { useParams, useRouter } from 'next/navigation'

import { consultaClientesType, consultaClientesSchema } from '@/types/consulta_clientes/consulta_clientes'
import { getById } from '@/actions/consulta_clientes/consulta_clientes'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useRef, useEffect } from 'react'

import uData from '@/utils/uData'
import { Messages } from 'primereact/messages'
import Loading from '@/components/loading'
import PageTitle from '@/components/pageTitle'
import PageSubTitle from '@/components/pageSubTitle'
import { Divider } from 'primereact/divider'

import { logicoNomeType } from '@/types/sistema/logicoNome'
import { InputTextarea } from 'primereact/inputtextarea'
import { Message } from 'primereact/message'

import { Document, Page, Text, StyleSheet, PDFViewer, View } from "@react-pdf/renderer"; // Other react-pdf components can be imported normally
import { styles } from '@/reports/estilos'
import { Cabecalho } from "@/reports/cabecalho"
import { Rodape } from "@/reports/rodape"
import { claimsType } from '@/types/sistema/claims'
import { getClaims } from '@/actions/sistema/acesso_sistema'
import { pdf } from '@react-pdf/renderer'

export default function Formulario() {

    const params = useParams<{ id: string; empresa_id: string }>()

    const offSet = uData.consultaOffSet()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const messages = useRef<Messages>(null);
    const [dados, setDados] = useState<consultaClientesType>({} as consultaClientesType)
    const [claims, setClaims] = useState<claimsType>({} as claimsType)

    const { control, handleSubmit, formState: { errors }, setValue, getValues, trigger } = useForm<consultaClientesType>({
        defaultValues: dados,
        values: dados,
        resolver: zodResolver(consultaClientesSchema)
    })

    const Relatorio = ({ pDados, pClaims }: { pDados: consultaClientesType, pClaims: claimsType }) => (

        <Document>

            <Page size="A4" orientation='landscape' style={styles.page}>

                {/* Cabeçalho */}
                <Cabecalho
                    empresa={pClaims.clienteSistemaNome}
                    titulo="Consulta a Cliente"
                />

                {/* Filtro */}

                {/* Dados */}
                <View style={styles.linhaEmBranco} />
                <View style={[styles.linha]}>
                    <Text style={[styles.textoTamanho10]}> {pDados.resultadoConsulta} </Text>
                </View>

                {/* Rodapé */}
                <Rodape
                    usuarioSistema={claims.usuarioSistemaNome}
                />

            </Page>

        </Document >

    )

    async function buscaDados() {

        setIsLoading(true)
        const retorno = await getById(Number(params.id), offSet)

        if (retorno.erro !== '') {
            setIsLoading(false)
            messages.current?.clear()
            messages.current?.show({ id: '1', sticky: true, severity: 'error', summary: 'Erro', detail: retorno.erro, closable: false })
            setDados({} as consultaClientesType)
        } else {
            messages.current?.clear()
            setDados(retorno.dados as consultaClientesType)
            setIsLoading(false)
        }

    }

    async function handleImprimir() {
        setIsLoading(true)

        const blob = await pdf(<Relatorio pDados={dados} pClaims={claims} />).toBlob()

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'relatorio.pdf'
        link.click()

        setIsLoading(false)
    }

    function mensagemConstaOcorrencias(pConstaOcorrencia: boolean) {
        if (pConstaOcorrencia) {
            return (
                <>
                    <Message severity="error" text="Consta Ocorrência" />
                </>
            )
        } else {
            return (
                <>
                    <Message severity="success" text="Não Consta Ocorrência" />
                </>
            )
        }
    }

    const logicoNomeConstaOcorrencia: logicoNomeType[] = [
        { logico: true, nome: 'Sim' },
        { logico: false, nome: 'Não' },
    ]

    // Clain
    async function buscaClaims() {
        const lClaims: claimsType = await getClaims()
        setClaims(lClaims)
    }

    useEffect(() => {
        buscaDados()
        buscaClaims()
    }, [])

    return (

        <div className="px-10">

            <PageTitle texto="Consulta de Clientes" />
            {/* <PageSubTitle texto="Detalhamento" /> */}

            <Divider />

            <Messages ref={messages} />

            <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex flex-col">
                        <Controller
                            name="id"
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
                            name="idConsulta"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>ID Consulta</label>
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
                            name="dataHoraConsulta"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data/Hora Consulta</label>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/mm/yy"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        showTime showSeconds hourFormat="24"
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="cpfCnpj"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>CPF/CNPJ</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        // maxLength={60}
                                        // autoFocus
                                        readOnly
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="nomeRazaoSocial"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Nome/Razão Social</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        // maxLength={60}
                                        // autoFocus
                                        readOnly
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    {/* <div className="flex flex-col">
                        <Controller
                            name="constaOcorrencias"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Consta Ocorrência</label>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nome"
                                        optionValue="logico"
                                        options={logicoNomeConstaOcorrencia}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div> */}

                    <div className="flex flex-col">
                        <Controller
                            name="score"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Score</label>
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
                            name="usuarioSistemaNome"
                            defaultValue=""
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Usuário/Sistema</label>
                                    <InputText
                                        id={field.name}
                                        value={field.value}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <Controller
                            name="dataHora"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name}>Data/Hora</label>
                                    <Calendar
                                        inputId={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd/mm/yy"
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                        showTime showSeconds hourFormat="24"
                                        disabled
                                    />
                                    {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                                </>
                            )}
                        />
                    </div>

                </div>

                <div className="flex flex-col mt-3">
                    {mensagemConstaOcorrencias(dados.constaOcorrencias)}
                </div>

                <div className="flex flex-col mt-3">
                    <Controller
                        name="resultadoConsulta"
                        defaultValue=""
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name}>Resultado da Consulta</label>
                                <InputTextarea
                                    id={field.name}
                                    value={field.value}
                                    className={classNames({ 'p-invalid': fieldState.error })}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    readOnly
                                    rows={15}
                                // cols={30}
                                />
                                {errors[field.name] && (<small className='p-error'>{errors[field.name]?.message}</small>)}
                            </>
                        )}
                    />
                </div>

                <Divider />

                <div className="flex justify-center mt-2 gap-2">

                    <Button label="Gerar PDF" type="button" icon="pi pi-file-pdf" onClick={handleImprimir} />
                    <Button label="Voltar" type="button" icon="pi pi-arrow-left" onClick={router.back} />

                </div>

                {/* <div className="h-screen mt-2">
                    {
                        <PDFViewer width="100%" height="100%">
                            <Relatorio pDados={dados} pClaims={claims} />
                        </PDFViewer>
                    }
                </div> */}

            </form>

            {
                isLoading && <Loading />
            }

        </div>
    )
}