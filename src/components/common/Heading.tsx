export default function Heading(props: {
    heading: string | React.ReactNode,
    actions?: React.ReactNode
}) {

    const { heading, actions } = props;

    return (
        <div className="flex items-center justify-between">
            <h1 className="font-black text-2xl">
                {heading}
            </h1>
            <div>
                {actions}
            </div>
        </div>
    )
}