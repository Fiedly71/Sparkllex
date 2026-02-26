/**
 * Sparkllex Chat Widget
 * Floating chat button with WhatsApp and quick actions
 */

(function() {
    // Configuration
    const WHATSAPP_NUMBER = '16177788441';
    const EMAIL = 'contactsparkless@sparkllex.com';
    
    // Multi-language texts
    const chatTexts = {
        en: {
            title: 'Need Help?',
            whatsapp: 'Chat on WhatsApp',
            email: 'Send Email',
            call: 'Call Us',
            close: 'Close'
        },
        es: {
            title: '¿Necesitas Ayuda?',
            whatsapp: 'Chat en WhatsApp',
            email: 'Enviar Email',
            call: 'Llamar',
            close: 'Cerrar'
        },
        fr: {
            title: 'Besoin d\'Aide?',
            whatsapp: 'Chat WhatsApp',
            email: 'Envoyer Email',
            call: 'Appeler',
            close: 'Fermer'
        },
        pt: {
            title: 'Precisa de Ajuda?',
            whatsapp: 'Chat no WhatsApp',
            email: 'Enviar Email',
            call: 'Ligar',
            close: 'Fechar'
        },
        de: {
            title: 'Brauchen Sie Hilfe?',
            whatsapp: 'Chat auf WhatsApp',
            email: 'E-Mail senden',
            call: 'Anrufen',
            close: 'Schließen'
        },
        it: {
            title: 'Hai Bisogno di Aiuto?',
            whatsapp: 'Chat su WhatsApp',
            email: 'Invia Email',
            call: 'Chiama',
            close: 'Chiudi'
        }
    };

    function getLang() {
        const stored = localStorage.getItem('preferredLang');
        const supported = ['en', 'es', 'fr', 'pt', 'de', 'it'];
        return supported.includes(stored) ? stored : 'en';
    }

    function createChatWidget() {
        const lang = getLang();
        const t = chatTexts[lang];

        // Styles
        const style = document.createElement('style');
        style.innerHTML = `
            .sparkllex-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9998;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .chat-bubble {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #008080, #006666);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 128, 128, 0.4);
                transition: all 0.3s ease;
                animation: pulse-chat 2s infinite;
            }
            
            .chat-bubble:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 30px rgba(0, 128, 128, 0.5);
            }
            
            .chat-bubble i {
                color: white;
                font-size: 24px;
            }
            
            .chat-menu {
                position: absolute;
                bottom: 70px;
                right: 0;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                padding: 16px;
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }
            
            .chat-menu.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .chat-menu-header {
                font-weight: bold;
                color: #008080;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #eee;
            }
            
            .chat-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.2s;
                text-decoration: none;
                color: #333;
            }
            
            .chat-option:hover {
                background: #f0fdfa;
            }
            
            .chat-option i {
                width: 24px;
                text-align: center;
                font-size: 18px;
            }
            
            .chat-option.whatsapp i { color: #25D366; }
            .chat-option.email i { color: #008080; }
            .chat-option.call i { color: #008080; }
            
            @keyframes pulse-chat {
                0%, 100% { box-shadow: 0 4px 20px rgba(0, 128, 128, 0.4); }
                50% { box-shadow: 0 4px 30px rgba(0, 128, 128, 0.6); }
            }
            
            @media (max-width: 768px) {
                .sparkllex-chat-widget {
                    bottom: 80px;
                    right: 15px;
                }
                .chat-bubble {
                    width: 50px;
                    height: 50px;
                }
                .chat-bubble i {
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);

        // Widget HTML
        const widget = document.createElement('div');
        widget.className = 'sparkllex-chat-widget';
        widget.innerHTML = `
            <div class="chat-menu" id="chat-menu">
                <div class="chat-menu-header">${t.title}</div>
                <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" class="chat-option whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>${t.whatsapp}</span>
                </a>
                <a href="mailto:${EMAIL}" class="chat-option email">
                    <i class="fas fa-envelope"></i>
                    <span>${t.email}</span>
                </a>
                <a href="tel:+${WHATSAPP_NUMBER}" class="chat-option call">
                    <i class="fas fa-phone"></i>
                    <span>${t.call}</span>
                </a>
            </div>
            <div class="chat-bubble" id="chat-bubble">
                <i class="fas fa-comments"></i>
            </div>
        `;

        document.body.appendChild(widget);

        // Toggle menu
        const bubble = document.getElementById('chat-bubble');
        const menu = document.getElementById('chat-menu');
        let isOpen = false;

        bubble.addEventListener('click', () => {
            isOpen = !isOpen;
            menu.classList.toggle('open', isOpen);
            bubble.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-comments';
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!widget.contains(e.target) && isOpen) {
                isOpen = false;
                menu.classList.remove('open');
                bubble.querySelector('i').className = 'fas fa-comments';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createChatWidget);
    } else {
        createChatWidget();
    }
})();
