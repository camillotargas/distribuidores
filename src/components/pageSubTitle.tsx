export default function PageSubTitle(props: { texto: string } ) {
    return (
        <h1 className="font-medium text-secondary-foreground text-center">{props.texto}</h1>
    )
}
