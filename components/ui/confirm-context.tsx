// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'

interface ConfirmOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'info' | 'warning'
    inputPlaceholder?: string
    inputDefaultValue?: string
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean | string>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function useConfirm() {
    const context = useContext(ConfirmContext)
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmDialogProvider')
    }
    return context
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [options, setOptions] = useState<ConfirmOptions>({ title: '', message: '' })
    const [inputValue, setInputValue] = useState('')
    const resolveRef = useRef<((value: boolean | string) => void) | null>(null)

    const confirm = useCallback((opts: ConfirmOptions) => {
        setOptions(opts)
        setInputValue(opts.inputDefaultValue || '')
        setIsOpen(true)
        return new Promise<boolean | string>((resolve) => {
            resolveRef.current = resolve
        })
    }, [])

    const handleClose = (value: boolean) => {
        setIsOpen(false)
        if (resolveRef.current) {
            if (value && options.inputPlaceholder) {
                resolveRef.current(inputValue)
            } else {
                resolveRef.current(value)
            }
            resolveRef.current = null
        }
    }

    
    const variantStyles = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        warning: {
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            confirmBtn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        info: {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    }

    const currentStyle = variantStyles[options.variant || 'danger']

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

                        {}
                        <div
                            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fade-in"
                            aria-hidden="true"
                            onClick={() => handleClose(false)}
                        ></div>

                        {}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {}
                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-scale-in">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${currentStyle.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                                        <div className={currentStyle.iconColor}>
                                            {currentStyle.icon}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
                                            {options.title}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500">
                                                {options.message}
                                            </p>
                                            {options.inputPlaceholder && (
                                                <input
                                                    type="text"
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    placeholder={options.inputPlaceholder}
                                                    className="mt-4 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className={`w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${currentStyle.confirmBtn}`}
                                    onClick={() => handleClose(true)}
                                >
                                    {options.confirmText || 'Confirmer'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    onClick={() => handleClose(false)}
                                >
                                    {options.cancelText || 'Annuler'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    )
}