import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, projectType, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // ── Option A: log to console (works immediately, no setup needed) ──
    console.log('📬 New contact form submission:')
    console.log(`  Name: ${name}`)
    console.log(`  Email: ${email}`)
    console.log(`  Project Type: ${projectType}`)
    console.log(`  Message: ${message}`)

    // ── Option B: Resend (uncomment after adding RESEND_API_KEY to Vercel env) ──
    // import { Resend } from 'resend'
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'Portfolio <onboarding@resend.dev>',
    //   to: process.env.CONTACT_TO_EMAIL!,
    //   subject: `New inquiry from ${name} — ${projectType}`,
    //   html: `<p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Project:</b> ${projectType}<br/><b>Message:</b><br/>${message}</p>`,
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
