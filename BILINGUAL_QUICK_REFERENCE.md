# Bilingual System Quick Reference

## 🚀 Quick Start

### To make a page bilingual:

1. **Include these scripts in your `<head>` (in this order):**
   ```html
   <script src="../translations.js"></script>
   <script src="../apply-translations.js"></script>
   ```

2. **Add translation keys for any text:**
   ```html
   <h1 id="pageTitle">My Title</h1>
   <button id="submitBtn">Submit</button>
   <input id="emailField" placeholder="Email">
   ```

3. **Define translations in translations.js:**
   ```javascript
   const translations = {
       en: {
           pageTitle: "My Title",
           submitBtn: "Submit",
           emailField: "Email"
       },
       es: {
           pageTitle: "Mi Título",
           submitBtn: "Enviar",
           emailField: "Correo"
       }
   };
   ```

---

## 🌐 URL Examples

| Link | Result |
|------|--------|
| `yoursite.com/index.html` | English (default) |
| `yoursite.com/index.html?lang=es` | Spanish |
| `yoursite.com/index.html?lang=en` | English (explicit) |
| `yoursite.com/signup.html?lang=es` | Spanish signup |

---

## 💾 How Language Persists

1. User visits: `yoursite.com/login.html?lang=es`
2. Page loads in Spanish, `lang=es` saved to localStorage
3. User navigates to: `yoursite.com/index.html` (no ?lang parameter)
4. Page still shows Spanish (from saved localStorage)
5. User visits: `yoursite.com/index.html?lang=en`
6. Page switches to English, localStorage updated to `lang=en`

---

## 📝 Available Functions

### In JavaScript:
```javascript
// Get current language
const lang = getCurrentLang(); // Returns 'en' or 'es'

// Switch language
setLanguage('es');  // Switches to Spanish & reloads page
setLanguage('en');  // Switches to English & reloads page

// Get translated text (if needed in JavaScript)
const text = t('pageTitle'); // Returns translated text
```

---

## 🎯 Translation Key Locations

### Current keys in translations.js:

**Navigation:**
- `btnAccess`, `homeNav`, `servicesNav`, `plansNav`, `howItWorksNav`

**Marketing/Landing:**
- `indexTitle`, `indexSubtitle`, `getStarted`, `viewServices`
- `ourServices`, `deepCleaning`, `eliteLaundry`, `masterIroning`, `maintenance`
- `whyChooseSparkllex`, `totalTrust`, `premiumQuality`, `flexibility`

**Pricing:**
- `subscriptionPlans`, `basicPlan`, `proPlan`, `familiarPlan`
- `perMonth`, `seeMore1`, `seeMore2`, `seeMore3`

**Forms:**
- `loginTitle`, `loginEmail`, `loginPassword`, `loginButton`
- `signupTitle`, `signupEmail`, `signupPassword`, `signupButton`

**Stats:**
- `clients`, `rating`, `support`, `guarantee`

**Contact:**
- `contact`, `callUs`

---

## ✨ Element Type Handling

| Element Type | Translated Property | Example |
|---|---|---|
| `<h1>, <p>, <button>, <div>` | textContent | `<h1 id="key">Text</h1>` |
| `<input>, <textarea>` | placeholder | `<input id="key" placeholder="...">` |
| `<option>, <optgroup>` | label & text | `<option id="key">Text</option>` |

---

## 🔗 Sharing Bilingual Links

**English link (default):**
```
https://yoursite.com/page.html
```

**Spanish link:**
```
https://yoursite.com/page.html?lang=es
```

Send the Spanish link to staff/partners → they'll see the entire site in Spanish!

---

## 🛠️ Adding New Translations

1. Open `translations.js`
2. Add new key to BOTH `en` and `es` objects:
   ```javascript
   en: {
       // ... existing keys ...
       newFeature: "New Feature Name",
   },
   es: {
       // ... existing keys ...
       newFeature: "Nombre de Nueva Característica",
   }
   ```
3. In HTML, use that id:
   ```html
   <div id="newFeature">New Feature Name</div>
   ```
4. Done! The page will automatically translate.

---

## ⚠️ Common Mistakes

❌ **Wrong:** Element without ID
```html
<h1>Title</h1> <!-- Won't translate -->
```

✅ **Right:** Element with matching ID
```html
<h1 id="pageTitle">Title</h1> <!-- Will translate -->
```

---

❌ **Wrong:** ID doesn't exist in translations.js
```html
<h1 id="unknownKey">Title</h1> <!-- Won't find translation -->
```

✅ **Right:** ID is in translations.js
```javascript
en: { pageTitle: "Title" }
// And in HTML:
<h1 id="pageTitle">Title</h1>
```

---

❌ **Wrong:** Scripts in wrong order
```html
<script src="../apply-translations.js"></script>
<script src="../translations.js"></script> <!-- Too late! -->
```

✅ **Right:** Translations first, then engine
```html
<script src="../translations.js"></script>
<script src="../apply-translations.js"></script>
```

---

## 🧪 Testing Your Translations

1. Open DevTools (F12)
2. Go to Console tab
3. Test the current language:
   ```javascript
   getCurrentLang()  // Should return 'en' or 'es'
   ```

4. Test a translation key:
   ```javascript
   t('pageTitle')  // Should return translated text
   ```

5. Check localStorage:
   ```javascript
   localStorage.getItem('sparkllex_lang')  // Should show 'en' or 'es'
   ```

---

## 📊 Files Modified

- ✅ `translations.js` - Dictionary + helpers
- ✅ `apply-translations.js` - Translation engine
- ✅ All HTML files in:
  - `/01_MARKETING/`
  - `/02_MEMBERS_APP/`
  - `/03_OPERATIONS/`
  - `/04_ADMIN_METRICS/`
  - Root `/privacy.html`

---

## 📚 Full Documentation

See `BILINGUAL_SYSTEM_GUIDE.md` for comprehensive documentation.

---

**Ready to go bilingual!** 🌍
