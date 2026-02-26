// Contact Form API - Saves messages to Supabase + Email notification
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Email notification function (uses Resend if configured)
async function sendEmailNotification(contactData) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'contactsparkless@sparkllex.com';
    
    if (!RESEND_API_KEY) {
        console.log('No RESEND_API_KEY configured, skipping email notification');
        return;
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Sparkllex Contact Form <noreply@sparkllex.com>',
                to: NOTIFICATION_EMAIL,
                subject: `[Contact Form] ${contactData.subject} - ${contactData.name}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: #008080; color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">New Contact Message</h1>
                        </div>
                        <div style="padding: 20px; background: #f9f9f9;">
                            <h2 style="color: #008080; margin-top: 0;">Message Details</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.phone || 'Not provided'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactData.subject}</td>
                                </tr>
                            </table>
                            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                                <h3 style="color: #008080; margin-top: 0;">Message:</h3>
                                <p style="white-space: pre-wrap;">${contactData.message}</p>
                            </div>
                        </div>
                        <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                            <p>This message was sent from the Sparkllex contact form.</p>
                        </div>
                    </div>
                `
            })
        });

        if (!response.ok) {
            console.error('Email notification failed:', await response.text());
        } else {
            console.log('Email notification sent successfully');
        }
    } catch (error) {
        console.error('Email notification error:', error);
    }
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'subject', 'message']
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Save to Supabase
        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone ? phone.trim() : null,
                subject: subject,
                message: message.trim(),
                status: 'new',
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to save message' });
        }

        // Send email notification (async, don't block response)
        sendEmailNotification({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            subject: subject,
            message: message.trim()
        });

        // Success response
        return res.status(200).json({ 
            success: true,
            message: 'Your message has been received. We will respond within 24 hours.',
            id: data[0]?.id
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
