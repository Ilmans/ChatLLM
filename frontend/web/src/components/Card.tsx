import { ReactNode } from "react"

interface Props {
    children: ReactNode
    title?: string
}

export default function Card(props: Props) {
    return (

        <div className="card border rounded-md border-gray-400">
            {props.title && (
                <div className="card-header border-gray-400 p-4 border-b">
                    <h3 className="card-title font-bold">{props.title}</h3>
                </div>
            )}
            <div className="card-body p-4 ">
                {props.children}
            </div>
        </div>
    )
}