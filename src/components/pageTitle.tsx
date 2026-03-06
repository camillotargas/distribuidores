export default function PageTitle(props: { texto: string } ) {
    return (
        <h1 className="font-semibold text-secondary-foreground pt-2 text-center">{props.texto}</h1>
    )
}
