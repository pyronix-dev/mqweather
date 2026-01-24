// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'

const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || "https://techcrunch.com"

export async function GET() {
    try {
        const response = await fetch(`${WORDPRESS_SITE_URL}/wp-json/wp/v2/posts?per_page=3&_fields=id,date,link,title,excerpt`, {
            next: { revalidate: 3600 } 
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching WordPress posts:', error)
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
    }
}