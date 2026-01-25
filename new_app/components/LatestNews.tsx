// Developed by Omar Rafik (OMX) - omx001@proton.me
"use client"

import { useEffect, useState } from "react"
import DOMPurify from "isomorphic-dompurify"


interface WPPost {
    id: number
    date: string
    link: string
    title: {
        rendered: string
    }
    excerpt: {
        rendered: string
    }
}



const WORDPRESS_SITE_URL = "https://techcrunch.com"

export function LatestNews() {
    const [posts, setPosts] = useState<WPPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchNews() {
            try {

                const res = await fetch('/api/news')

                if (!res.ok) throw new Error("Failed to fetch")

                const data = await res.json()
                setPosts(data)
            } catch (err) {
                console.error("News fetch error:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchNews()
    }, [])

    if (error) {

        return null
    }

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 animate-pulse">
                <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-12 bg-slate-100 rounded-lg"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#FEFAE0] rounded-2xl p-5 shadow-sm border border-[#E6E2C8] animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Actualités</h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">Blog</span>
            </div>

            <div className="space-y-3">
                {posts.map((post) => (
                    <a
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200"
                    >
                        <h4
                            className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title.rendered) }}
                        />

                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-400 video-transition"></div>
                            <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <a
                    href={WORDPRESS_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                >
                    Voir tous les articles →
                </a>
            </div>
        </div>
    )
}