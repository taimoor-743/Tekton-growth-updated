import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, outputLink, error } = body

    // Validate input
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Invalid or missing id' },
        { status: 400 }
      )
    }

    if (error) {
      // Handle error case
      if (typeof error !== 'string') {
        return NextResponse.json(
          { ok: false, message: 'Invalid error message' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('requests')
        .update({
          status: 'error',
          error_message: error,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error('Error updating request:', updateError)
        return NextResponse.json(
          { ok: false, message: 'Failed to update request' },
          { status: 500 }
        )
      }

      return NextResponse.json({ ok: true })
    }

    // Handle success case
    if (!outputLink || typeof outputLink !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Invalid or missing outputLink' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('requests')
      .update({
        status: 'ready',
        output_link: outputLink,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('Error updating request:', updateError)
      return NextResponse.json(
        { ok: false, message: 'Failed to update request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
