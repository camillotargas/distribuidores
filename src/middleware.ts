import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {

    const wToken = request.cookies.get('cDistribuidorToken')?.value

    const urlLogin = new URL('/', request.url)
    const urlAdmin = new URL('/admin', request.url)

    if (!wToken) {

        // console.log("---- NÃo tem token ----")
        
        if (request.nextUrl.pathname === '/') {
            return NextResponse.next()
        }

        return NextResponse.redirect(urlLogin)

    } else {

        // console.log("---- tem token ----")
        if (request.nextUrl.pathname === '/') {
            return NextResponse.redirect(urlAdmin)
        }

    }
    
}

export const config = {
    matcher: ["/", "/admin/:path*"]
}