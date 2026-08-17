import React from 'react'
import { ArrowLeftIcon, EyeIcon, Code2Icon, ExternalLinkIcon, Loader2Icon, GlobeIcon, DownloadIcon  } from 'lucide-react'

const BuilderHeader = ({
    projectName,
    version,
    showCode,
    publishing,
    previewUrl,
    onToggleShowCode,
    onOpenPreview,
    onPublish,
    onDownload,
    onBack,
    onLogout,
}) => {
  return (
<header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-zinc-400 bg-white">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className='p-1.5 rounded-md text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer'>
                <ArrowLeftIcon size={18} />
            </button>
            <img src="/logo.svg" alt="" className="invert size-5" />
            <span className="text-sm font-semibold truncate max-w-38 md:max-w-50">
            {projectName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium">v{version}</span>
        </div>

        <div className="flex items-center gap-1.5">
            <button onClick={onToggleShowCode}
            className={`inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white ${showCode ? "bg-zinc-100 text-zinc-900" : ""}`}>
                {showCode ? (
                    <>
                    <EyeIcon size={18}/> Preview
                    </>
                ) : (
                    <>
                    <Code2Icon size={18}/> Code
                    </>
                )}
            </button>

            {/* <button onClick={onOpenPreview}
            className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white'>
                <ExternalLinkIcon size={18} /> Open Preview
            </button> */}
            <a
    href={previewUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white"
>
    <ExternalLinkIcon size={18} />
    Open Preview
</a>

            <button onClick={onPublish} disabled={publishing}
            className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white'>
                {publishing ? <Loader2Icon size={18} className="animate-spin"/> : <GlobeIcon size={18}/>} Publish
            </button>

            <button onClick={onDownload}
            className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-300 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white'>
                <DownloadIcon size={18} /> Export
            </button>
             <button onClick={onLogout}
            className='inline-flex items-center justify-center gap-1.5 py-1.5 px-3 border border-zinc-400 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 text-s font-medium rounded-lg cursor-pointer bg-white'>
                Sign Out
            </button>
        </div>

    </header> 
     )
}

export default BuilderHeader