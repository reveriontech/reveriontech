import { next, rewrite } from '@vercel/edge'

const CHANGE_ORDER_HOST = 'change-order.reveriontech.com'

export const config = {
  matcher: '/:path*',
}

export default function middleware(request: Request) {
  const url = new URL(request.url)
  if (url.hostname !== CHANGE_ORDER_HOST) {
    return next()
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return rewrite(new URL('/changeorder/change-order-form.html', url.origin))
  }
  return next()
}
