/**
 * Sparkllex Configuration File
 * Professional configuration settings for the application
 * Copyright © 2026 Sparkllex. All rights reserved.
 */

// ============================================
// COMPANY INFORMATION
// ============================================
const COMPANY_NAME = 'Sparkllex';

// ============================================
// CONTACT INFORMATION
// ============================================
const CONTACT_INFO = {
    companyName: 'Sparkllex',
    whatsapp: '+1234567890',
    email: 'contactsparkless@sparkllex.com',
    phone: '+1 (555) 123-4567',
    address: 'Your Address Here',
    hours: {
        weekdays: '8:00 AM - 10:00 PM',
        weekends: '8:00 AM - 10:00 PM',
        availability: '24/7'
    },
    social: {
        facebook: 'https://facebook.com/sparkllex',
        instagram: 'https://instagram.com/sparkllex',
        twitter: 'https://twitter.com/sparkllex'
    }
};

// ============================================
// SERVICES ARRAY
// ============================================
const SERVICES = [
    {
        id: 1,
        name: 'Limpieza',
        nameEN: 'Cleaning',
        icon: '🏠',
        description: 'Limpieza profunda y detallada de todos los espacios, con productos ecológicos de primera calidad.',
        descriptionEN: 'Deep and detailed cleaning of all spaces, with premium eco-friendly products.',
        features: [
            'Limpieza profunda',
            'Productos ecológicos',
            'Desinfección completa'
        ],
        featuresEN: [
            'Deep cleaning',
            'Eco-friendly products',
            'Complete disinfection'
        ]
    },
    {
        id: 2,
        name: 'Lavado',
        nameEN: 'Laundry',
        icon: '👕',
        description: 'Servicio profesional de lavandería con cuidado especial para prendas delicadas y materiales premium.',
        descriptionEN: 'Professional laundry service with special care for delicate garments and premium materials.',
        features: [
            'Lavado especializado',
            'Telas delicadas',
            'Detergentes premium'
        ],
        featuresEN: [
            'Specialized washing',
            'Delicate fabrics',
            'Premium detergents'
        ]
    },
    {
        id: 3,
        name: 'Planchado',
        nameEN: 'Ironing',
        icon: '👔',
        description: 'Planchado experto con resultados impecables, ideal para prendas delicadas y trajes de lujo.',
        descriptionEN: 'Expert ironing with impeccable results, ideal for delicate garments and luxury suits.',
        features: [
            'Planchado profesional',
            'Acabado perfecto',
            'Manejo experto'
        ],
        featuresEN: [
            'Professional ironing',
            'Perfect finish',
            'Expert handling'
        ]
    },
    {
        id: 4,
        name: 'Reparaciones',
        nameEN: 'Repairs',
        icon: '🔧',
        description: 'Servicio de reparación y mantenimiento con técnicos especializados y garantía de calidad.',
        descriptionEN: 'Repair and maintenance service with specialized technicians and quality guarantee.',
        features: [
            'Reparaciones experto',
            'Mantenimiento garantizado',
            'Técnicos certificados'
        ],
        featuresEN: [
            'Expert repairs',
            'Guaranteed maintenance',
            'Certified technicians'
        ]
    }
];

// ============================================
// STRIPE CONFIGURATION
// ============================================
const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51SZlQ1IccQ4MNulwcJxTi0dO18r1sGlWGc7y7Z8RZRXfCUU58PD7NXL0pYJJM8XuMb2GmNUNPy3fQf2xtaNnOzGb00u76i0tWP',
    priceIds: {
        basic: 'price_1Ss6yTIccQ4MNulwrZnZFdTx',
        pro: 'price_1Ss6zEIccQ4MNulwvkTloCjn',
        family: 'price_1Ss703IccQ4MNulwaKlBAh5R'
    },
    currency: 'usd',
    mode: 'test' // 'test' or 'live'
};

// ============================================
// PRICING PLANS
// ============================================
const PRICING_PLANS = [
    {
        id: 1,
        name: 'Básico',
        nameEN: 'Basic',
        price: 79,
        stripePriceId: 'price_1Ss6yTIccQ4MNulwrZnZFdTx',
        currency: '$',
        period: 'mes',
        periodEN: 'month',
        description: 'Para necesidades simples',
        descriptionEN: 'For simple needs',
        featured: false,
        features: [
            {
                name: 'Limpieza semanal',
                nameEN: 'Weekly cleaning',
                included: true
            },
            {
                name: 'Lavado básico',
                nameEN: 'Basic laundry',
                included: true
            },
            {
                name: 'Soporte por WhatsApp',
                nameEN: 'WhatsApp support',
                included: true
            },
            {
                name: 'Planchado premium',
                nameEN: 'Premium ironing',
                included: false
            },
            {
                name: 'Reparaciones incluidas',
                nameEN: 'Included repairs',
                included: false
            }
        ],
        cta: 'Elegir Plan',
        ctaEN: 'Choose Plan'
    },
    {
        id: 2,
        name: 'Pro',
        nameEN: 'Pro',
        price: 149,
        stripePriceId: 'price_1Ss6zEIccQ4MNulwvkTloCjn',
        currency: '$',
        period: 'mes',
        periodEN: 'month',
        description: 'Para profesionales ocupados',
        descriptionEN: 'For busy professionals',
        featured: true,
        badge: '⭐ MÁS POPULAR ⭐',
        badgeEN: '⭐ MOST POPULAR ⭐',
        features: [
            {
                name: 'Limpieza quincenal',
                nameEN: 'Bi-weekly cleaning',
                included: true
            },
            {
                name: 'Lavado + Planchado',
                nameEN: 'Laundry + Ironing',
                included: true
            },
            {
                name: 'Soporte prioritario',
                nameEN: 'Priority support',
                included: true
            },
            {
                name: 'Planchado premium',
                nameEN: 'Premium ironing',
                included: true
            },
            {
                name: 'Reparaciones ilimitadas',
                nameEN: 'Unlimited repairs',
                included: false
            }
        ],
        cta: 'Comenzar Ahora',
        ctaEN: 'Start Now'
    },
    {
        id: 3,
        name: 'Familiar',
        nameEN: 'Family',
        price: 249,
        stripePriceId: 'price_1Ss703IccQ4MNulwaKlBAh5R',
        currency: '$',
        period: 'mes',
        periodEN: 'month',
        description: 'Para grandes familias',
        descriptionEN: 'For large families',
        featured: false,
        features: [
            {
                name: 'Limpieza semanal completa',
                nameEN: 'Complete weekly cleaning',
                included: true
            },
            {
                name: 'Lavado + Planchado ilimitado',
                nameEN: 'Unlimited laundry + ironing',
                included: true
            },
            {
                name: 'Soporte 24/7',
                nameEN: '24/7 support',
                included: true
            },
            {
                name: 'Planchado premium',
                nameEN: 'Premium ironing',
                included: true
            },
            {
                name: 'Reparaciones incluidas',
                nameEN: 'Included repairs',
                included: true
            }
        ],
        cta: 'Elegir Plan',
        ctaEN: 'Choose Plan'
    }
];

// ============================================
// APPLICATION CONFIGURATION
// ============================================
const config = {
    // Application metadata
    appName: COMPANY_NAME,
    version: '1.0.0',
    environment: 'production',
    year: new Date().getFullYear(),
    
    // API Configuration
    api: {
        baseURL: 'https://api.sparkllex.com/v1',
        timeout: 5000,
        retries: 3
    },
    
    // Authentication
    auth: {
        tokenKey: 'sparkllex_token',
        refreshKey: 'sparkllex_refresh_token',
        expirationTime: 3600000 // 1 hour in milliseconds
    },
    
    // Logging
    logging: {
        enabled: true,
        level: 'info' // 'debug', 'info', 'warn', 'error'
    },
    
    // Feature flags
    features: {
        aiSupport: true,
        bookingSystem: true,
        membershipTracking: true,
        crmIntegration: true,
        metrics: true,
        whatsappIntegration: true
    },
    
    // UI Configuration
    ui: {
        theme: 'dark',
        language: 'es', // 'en' or 'es'
        defaultPageSize: 20,
        colors: {
            primary: '#D4AF37', // Amber Gold
            dark: '#0F0F0F',
            darkCard: '#1A1A1A'
        }
    }
};

// ============================================
// EXPORT FOR BROWSER AND NODE.JS ENVIRONMENTS
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    // Node.js export
    module.exports = {
        COMPANY_NAME,
        CONTACT_INFO,
        SERVICES,
        PRICING_PLANS,
        STRIPE_CONFIG,
        config
    };
} else {
    // Browser global export
    window.SPARKLLEX = {
        COMPANY_NAME,
        CONTACT_INFO,
        SERVICES,
        PRICING_PLANS,
        STRIPE_CONFIG,
        config
    };
}
