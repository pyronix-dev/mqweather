"use client"

import 'react-phone-number-input/style.css'
import PhoneInput, { getCountryCallingCode, Country } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import fr from 'react-phone-number-input/locale/fr'
import React, { useState, useMemo, useRef, useEffect } from 'react'

const CustomCountrySelect = ({ value, onChange, options, labels, ...rest }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // reset search when closed
    useEffect(() => { if (!isOpen) setSearch("") }, [isOpen])

    const filteredOptions = useMemo(() => {
        if (!search) return options
        const lower = search.toLowerCase()
        return options.filter((option: any) => {
            if (!option.value) return false
            const name = (labels && labels[option.value]) || option.label || option.value
            const code = getCountryCallingCode(option.value as Country)
            return (
                (name && name.toLowerCase().includes(lower)) ||
                (code && code.includes(lower)) ||
                (option.value && option.value.toLowerCase().includes(lower))
            )
        })
    }, [search, options, labels])

    // Optimistic Flag Detection - Prioritize phone number if typed
    const detectedCountry = useMemo(() => {
        // Check the typed phone number FIRST before falling back to library's value
        if (rest.selectedPhone) {
            const num = rest.selectedPhone.replace(/\s/g, '') // remove spaces
            if (num.startsWith('+')) {
                // Priority Checks (Ambiguous codes)
                // +212 -> MA (Morocco) vs EH (Western Sahara)
                // +1 -> US (USA) vs CA, etc.
                // +596 -> MQ (Martinique)
                // +262 -> RE (Reunion) vs YT (Mayotte)
                if (num.startsWith('+212')) return 'MA'
                if (num.startsWith('+1')) return 'US'
                if (num.startsWith('+596')) return 'MQ'
                if (num.startsWith('+262')) return 'RE'
                if (num.startsWith('+33')) return 'FR'

                // Heuristic: Find first matching calling code
                const match = options.find((opt: any) => {
                    if (!opt.value) return false
                    const code = getCountryCallingCode(opt.value as Country)
                    return num.startsWith('+' + code)
                })
                if (match) return match.value
            }
        }
        // Fall back to library's value if no phone typed or no match
        return value || undefined
    }, [value, rest.selectedPhone, options])

    return (
        <div className="relative inline-block" ref={wrapperRef}>
            {/* Trigger Button with Flag and Chevron */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 pr-2 cursor-pointer focus:outline-none"
                aria-label="Changer de pays"
            >
                <div className="w-7 h-5 overflow-hidden rounded-sm border border-slate-200 shadow-sm relative">
                    {detectedCountry && flags[detectedCountry] ? (
                        React.createElement(flags[detectedCountry], { title: labels && detectedCountry ? labels[detectedCountry] : detectedCountry })
                    ) : (
                        rest.iconComponent && <rest.iconComponent country={detectedCountry} label={labels && detectedCountry ? labels[detectedCountry] : detectedCountry} />
                    )}
                </div>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-72 max-h-80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredOptions.length > 0 ? filteredOptions.map((option: any) => {
                            if (!option.value) return null
                            const CountryIcon = flags[option.value as keyof typeof flags]
                            const countryName = (labels && labels[option.value]) || option.label || option.value
                            const callingCode = getCountryCallingCode(option.value as Country)

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg text-sm transition-colors ${value === option.value ? 'bg-slate-100 font-bold' : ''}`}
                                >
                                    {CountryIcon && (
                                        <div className="w-6 flex-shrink-0 overflow-hidden rounded-sm border border-slate-100 shadow-sm">
                                            {/* Render the flag component properly */}
                                            <CountryIcon title={countryName} className="block w-full h-auto object-contain" />
                                        </div>
                                    )}
                                    <span className="flex-1 truncate text-slate-700">{countryName}</span>
                                    <span className="text-slate-400 font-mono text-xs">+{callingCode}</span>
                                </button>
                            )
                        }) : (
                            <div className="p-4 text-center text-sm text-slate-500">Aucun résultat</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export function UserPhoneInput({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled?: boolean }) {
    return (
        <div className="phone-input-container">
            <PhoneInput
                international
                addInternationalOption={false}
                defaultCountry="MQ"
                value={value}
                onChange={onChange}
                disabled={disabled}
                labels={fr}
                flags={flags}
                countrySelectComponent={CustomCountrySelect}
                countrySelectProps={{ selectedPhone: value }}
                className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <style jsx global>{`
                .PhoneInput {
                    display: flex;
                    align-items: center;
                }
                .PhoneInputCountry {
                    margin-right: 0.75rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                 /* Hide default select arrow if possible or style native */
                 
                 /* Ensure flag is visible */
                .PhoneInputCountryIcon {
                    width: 28px;
                    height: 20px;
                    display: block; 
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1); /* Nice shadow */
                    background-color: transparent;
                }
                 .PhoneInputCountryIconImg {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* Cover usually looks better for flags layout */
                    display: block;
                }
                .PhoneInputInput {
                    flex: 1;
                    min-width: 0;
                    background-color: transparent;
                    border: none;
                    outline: none; 
                    font-size: 1rem;
                    font-weight: 500;
                    color: #0f172a; /* Slate 900 */
                }
                .PhoneInputInput:focus {
                    outline: none;
                }
            `}</style>
        </div>
    )
}
