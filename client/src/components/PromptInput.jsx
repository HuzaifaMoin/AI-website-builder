import { useState, useRef, useEffect } from "react";
import React from "react";
import {CloudUploadIcon, MicIcon, ArrowRightIcon, Loader2Icon} from 'lucide-react'

const PromptInput = ({onSubmit, loading = false, placeholder = "Describe the website you want to build...", large = false, autoFocus = false, variant = "default"}) => {

  const [value, setValue] = useState("");
  const textareaRef = useRef(null)

  useEffect(()=>{
    if (autoFocus && textareaRef.current) {
        textareaRef.current.focus();
    }
  },[autoFocus])

  const handleSubmit = (e)=>{
      if(e) e.preventDefault()
      const trimmed = value.trim()
      if(!trimmed || loading) return;
      onSubmit(trimmed)
      setValue("")
  }

  const handleKeyDown = (e)=>{
      if(e.key === "Enter" && !e.shiftKey){
          e.preventDefault();
          handleSubmit()
      }
  }

if(variant === "glass"){
        return (
         <form
  onSubmit={handleSubmit}
  className="w-full max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
>
  <textarea
    ref={textareaRef}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder={placeholder}
    disabled={loading}
    rows={3}
    className="w-full bg-transparent resize-none outline-none px-5 pt-10 text-white placeholder:text-white/60"
  />

  <div className="flex items-center justify-between px-4 py-4">
    {/* Left */}
    <label
      htmlFor="file"
      className="flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 cursor-pointer"
    >
      <input id="file" type="file" hidden />
      <CloudUploadIcon size={18} />
    </label>

    {/* Right */}
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
      >
        <MicIcon size={18} />
      </button>

      <button
        type="submit"
        disabled={!value.trim() || loading}
        className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center disabled:opacity-50"
      >
        {loading ? (
          <Loader2Icon className="animate-spin" size={18} />
        ) : (
          <ArrowRightIcon size={18} />
        )}
      </button>
    </div>
  </div>
</form>
        )
     }

     return (
        <div className={`bg-white border border-zinc-200 rounded-xl flex items-end gap-2 focus-within:ring-1 focus-within:ring-zinc-300 transition ${large ? "p-4" : "p-3"}`}>

            <textarea ref={textareaRef}
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={loading}
            rows={large ? 5 : 1}
            className={`flex-1 bg-transparent border-none outline-none resize-none text-zinc-900 placeholder:text-zinc-400 ${large ? "text-base" : "text-sm"}`}/>

            <button onClick={()=> handleSubmit()}
        disabled={!value.trim() || loading}
        className='inline-flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-40 cursor-pointer rounded-full shrink-0'
        style={{
            width: large ? 36 : 24,
            height: large ? 36 : 24,
        }}>
                {loading ? <Loader2Icon size={large ? 20 : 15} className="animate-spin"/> : 
                <ArrowRightIcon size={large ? 20 : 15}/>}
            </button>
        </div>
    )

    }

export default PromptInput;