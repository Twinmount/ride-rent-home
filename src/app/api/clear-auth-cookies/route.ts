import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Cookies cleared' });
  
  // List of all possible Next-Auth cookies
  const cookiesToClear = [
    'next-auth.callback-url',
    'next-auth.csrf-token',
    'next-auth.session-token',
    '__Secure-next-auth.callback-url',
    '__Secure-next-auth.csrf-token',
    '__Secure-next-auth.session-token',
    '__Host-next-auth.csrf-token',
  ];

  // Clear each cookie with different configurations
  cookiesToClear.forEach(cookieName => {
    // Clear for current domain
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      maxAge: 0,
    });
    
    // Clear for parent domain
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      domain: 'ride.rent',
      maxAge: 0,
    });
    
    // Clear with dot prefix
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      domain: '.ride.rent',
      maxAge: 0,
    });
  });

  return response;
}