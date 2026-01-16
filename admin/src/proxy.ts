"use server";

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
]);

const isNormalRoute = createRouteMatcher([
  '/user(.*)'
]);


export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const {sessionClaims} = await auth();
    const userRole = sessionClaims?.role; 
    
    if (req.nextUrl.pathname.startsWith('/dashboard') && userRole !== 'admin') {
      // Redirect users without the admin role
      const homeUrl = new URL('/login', req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  if (isNormalRoute(req)) {
    const {userId} = await auth();
    if (req.nextUrl.pathname.startsWith('/user') && !userId) {
      const homeUrl = new URL('/login', req.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
});

// Configuration object for the middleware
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
