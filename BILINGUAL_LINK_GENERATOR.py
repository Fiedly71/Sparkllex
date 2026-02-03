#!/usr/bin/env python3
"""
SPARKLLEX BILINGUAL SYSTEM - AUTOMATED LINK GENERATOR
Use this script to quickly generate Spanish links for sharing

Usage:
    python bilingual_links.py

Or use this as a reference for manually creating links.
"""

# Configuration
SITE_URL = "https://yoursite.com"  # Change this to your actual site URL

# Marketing Pages
MARKETING_PAGES = {
    "Home": "01_MARKETING/index.html",
    "Login": "01_MARKETING/login.html",
    "Sign Up": "01_MARKETING/signup.html",
    "Pricing": "01_MARKETING/pricing.html",
    "Plan Básico": "01_MARKETING/plan-basico.html",
    "Plan Familiar": "01_MARKETING/plan-familiar.html",
    "Plan Pro": "01_MARKETING/plan-pro.html",
    "How It Works": "01_MARKETING/how-it-works.html",
    "Success": "01_MARKETING/success.html",
    "Terms": "01_MARKETING/terms.html",
    "Privacy": "01_MARKETING/privacy.html",
    "Cookies": "01_MARKETING/cookies.html",
}

# Members Pages
MEMBERS_PAGES = {
    "Appointments": "02_MEMBERS_APP/appointments.html",
    "Book Service": "02_MEMBERS_APP/book-service.html",
    "History": "02_MEMBERS_APP/history.html",
    "Membership Status": "02_MEMBERS_APP/membership-status.html",
    "Settings": "02_MEMBERS_APP/settings.html",
    "Support": "02_MEMBERS_APP/support.html",
    "Support IA": "02_MEMBERS_APP/support-ia.html",
}

# Operations Pages
OPERATIONS_PAGES = {
    "Agenda": "03_OPERATIONS/agenda.html",
    "CRM Clients": "03_OPERATIONS/crm-clients.html",
    "Staff Dashboard": "03_OPERATIONS/staff-dashboard.html",
    "Team Manager": "03_OPERATIONS/team-manager.html",
}

# Admin Pages
ADMIN_PAGES = {
    "Executive Finance": "04_ADMIN_METRICS/executive-finance.html",
    "Expansion": "04_ADMIN_METRICS/expansion.html",
}


def generate_links(pages, title, language="es"):
    """Generate bilingual links for a set of pages"""
    print(f"\n{'='*70}")
    print(f"{title.upper()}")
    print(f"{'='*70}\n")
    
    for page_name, page_path in pages.items():
        en_link = f"{SITE_URL}/{page_path}"
        es_link = f"{SITE_URL}/{page_path}?lang=es"
        
        print(f"📄 {page_name}")
        print(f"   🇬🇧 English: {en_link}")
        print(f"   🇪🇸 Spanish: {es_link}")
        print()


def generate_markdown_table(pages, title, language="es"):
    """Generate markdown table of links"""
    print(f"\n## {title}\n")
    print("| Page | English | Spanish |")
    print("|------|---------|---------|")
    
    for page_name, page_path in pages.items():
        en_link = f"{SITE_URL}/{page_path}"
        es_link = f"{SITE_URL}/{page_path}?lang=es"
        
        en_text = f"[Link]({en_link})"
        es_text = f"[Link]({es_link})"
        
        print(f"| {page_name} | {en_text} | {es_text} |")


def main():
    """Main function"""
    print("\n")
    print("╔" + "="*68 + "╗")
    print("║" + " "*15 + "SPARKLLEX BILINGUAL LINK GENERATOR" + " "*19 + "║")
    print("╚" + "="*68 + "╝")
    
    print(f"\nBase URL: {SITE_URL}")
    print("\nChoose an option:")
    print("1. View all links as text")
    print("2. Generate markdown table")
    print("3. Quick Spanish links (copy-paste ready)")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        generate_links(MARKETING_PAGES, "Marketing Pages")
        generate_links(MEMBERS_PAGES, "Members App Pages")
        generate_links(OPERATIONS_PAGES, "Operations Pages")
        generate_links(ADMIN_PAGES, "Admin Pages")
        
    elif choice == "2":
        print("\n\n# Sparkllex Bilingual Links\n")
        generate_markdown_table(MARKETING_PAGES, "Marketing Pages")
        generate_markdown_table(MEMBERS_PAGES, "Members App Pages")
        generate_markdown_table(OPERATIONS_PAGES, "Operations Pages")
        generate_markdown_table(ADMIN_PAGES, "Admin Pages")
        
    elif choice == "3":
        print("\n" + "="*70)
        print("SPANISH LINKS (Copy & Share)")
        print("="*70 + "\n")
        
        all_pages = {
            **MARKETING_PAGES,
            **MEMBERS_PAGES,
            **OPERATIONS_PAGES,
            **ADMIN_PAGES
        }
        
        for page_name, page_path in all_pages.items():
            es_link = f"{SITE_URL}/{page_path}?lang=es"
            print(f"{page_name:.<30} {es_link}")
    
    else:
        print("\n❌ Invalid choice. Please run again and choose 1, 2, or 3.")


# Quick Reference Section
QUICK_REFERENCE = """
╔════════════════════════════════════════════════════════════════════╗
║            BILINGUAL SYSTEM QUICK REFERENCE                       ║
╚════════════════════════════════════════════════════════════════════╝

1. TO SHARE A SPANISH LINK:
   ✓ Add ?lang=es to any URL
   ✓ Example: https://yoursite.com/signup.html?lang=es
   ✓ User sees Spanish
   ✓ Language saves automatically

2. TO TEST LANGUAGE SWITCHING:
   ✓ Open DevTools (F12)
   ✓ Go to Console tab
   ✓ Type: setLanguage('es')
   ✓ Page reloads in Spanish

3. TO CHECK CURRENT LANGUAGE:
   ✓ In Console: getCurrentLang()
   ✓ Returns: 'en' or 'es'

4. TO ADD MORE TRANSLATIONS:
   ✓ Edit translations.js
   ✓ Add key to both en & es objects
   ✓ Add id to HTML element
   ✓ Done! Auto-translates

5. SUPPORTED LANGUAGES:
   ✓ English (en) - Default
   ✓ Spanish (es) - Active
   ✓ More languages can be added

6. FILES TO REFERENCE:
   ✓ README_BILINGUAL.md - Overview
   ✓ BILINGUAL_QUICK_REFERENCE.md - Quick commands
   ✓ BILINGUAL_SYSTEM_GUIDE.md - Full documentation
   ✓ BILINGUAL_DEMO.html - Interactive demo
"""


if __name__ == "__main__":
    print(QUICK_REFERENCE)
    print("\n")
    
    # Uncomment to run interactive mode
    # main()
    
    # Or use these examples directly:
    print("="*70)
    print("QUICK SPANISH LINK EXAMPLES")
    print("="*70)
    print()
    print("Copy and share these links with your team:\n")
    
    examples = [
        ("Home Page", "https://yoursite.com/01_MARKETING/index.html?lang=es"),
        ("Sign Up", "https://yoursite.com/01_MARKETING/signup.html?lang=es"),
        ("Pricing", "https://yoursite.com/01_MARKETING/pricing.html?lang=es"),
        ("Login", "https://yoursite.com/01_MARKETING/login.html?lang=es"),
    ]
    
    for name, link in examples:
        print(f"{name:.<30} {link}")
    
    print("\n" + "="*70)
    print("✨ Tip: Language preference saves automatically!")
    print("   No need to add ?lang= to every link after the first one.")
    print("="*70)
