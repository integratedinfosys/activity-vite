import ModalSmall from "../components/ModalSmall"

export default function TestLayout() {
    return (
        <>
            <main>
                <div className="min-h-screen bg-slate-100">
                    <p>This is a very long section that consumes 100% viewport height!</p>
                </div>
                <div className="min-h-screen bg-slate-200">
                    <p>This is second long section that consumes 100% viewport height!</p>
                </div>
                <div className="min-h-screen bg-slate-100">
                    <p>This is third long section that consumes 100% viewport height!</p>
                </div>
                <div className="min-h-screen bg-slate-200">
                    <p>This is fourth long section that consumes 100% viewport height!</p>
                </div>
                <div className="min-h-screen bg-slate-100">
                    <p>This is fifth long section that consumes 100% viewport height!</p>
                </div>
            </main></>

    )
}
