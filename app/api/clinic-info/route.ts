import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch the clinic settings data from the kv store
        const settingsData = await kv.get('clinic_settings');

        if (settingsData) {
            // If data is found, return it as a JSON response
            return NextResponse.json(settingsData);
        } else {
            // If no data is found, return an object with empty strings
            return NextResponse.json({
                clinicName: '',
                address: '',
                phone: '',
                email: '',
                operatingHours: ''
            });
        }
    } catch (error) {
        // Log any error that occurs and return a 500 status with an error message
        console.error('Error retrieving settings:', error);
        return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();

        if (typeof data !== 'object' || data === null) {
            return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }

        await kv.set('clinic_settings', data);

        return NextResponse.json({ message: 'Settings updated successfully', data });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (typeof data !== 'object' || data === null) {
            return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
        }

        await kv.set('clinic_settings', data);

        return NextResponse.json({ message: 'Settings created/updated successfully', data });
    } catch (error) {
        console.error('Error creating/updating settings:', error);
        return NextResponse.json({ error: 'Failed to create/update settings' }, { status: 500 });
    }
}
