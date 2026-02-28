import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let email: string
  let firstName: string | undefined

  try {
    const body = await request.json()
    email = body.email
    firstName = body.firstName
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  let response: Response
  try {
    response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
      },
      body: JSON.stringify({ email, firstName, source: 'signup' }),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach Loops API' }, { status: 502 })
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    return NextResponse.json({ error: 'Invalid response from Loops API' }, { status: 502 })
  }

  if (!response.ok) {
    return NextResponse.json({ error: data }, { status: response.status })
  }

  return NextResponse.json(data)
}
