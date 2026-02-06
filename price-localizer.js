(() => {
    const USD_TO_CLP = 858.166;
    const CL_COUNTRY_CODE = 'CL';

    const formatClp = (usd) => {
        const clp = Math.round(Number(usd) * USD_TO_CLP);
        return `CLP $${clp.toLocaleString('es-CL')}`;
    };

    const updateForChile = () => {
        document.querySelectorAll('[data-price-usd]').forEach((el) => {
            if (!el.dataset.original) {
                el.dataset.original = el.textContent.trim();
            }
            const usd = Number(el.dataset.priceUsd);
            if (!Number.isFinite(usd)) {
                return;
            }
            el.textContent = formatClp(usd);
        });

        document.querySelectorAll('option[data-price-usd]').forEach((opt) => {
            if (!opt.dataset.original) {
                opt.dataset.original = opt.textContent;
            }
            const usd = Number(opt.dataset.priceUsd);
            if (!Number.isFinite(usd)) {
                return;
            }
            const label = (opt.dataset.planLabel || opt.textContent.split('-')[0]).trim();
            opt.textContent = `${label} - ${formatClp(usd)}/mes`;
        });
    };

    const detectCountryAndApply = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            const countryCode = (data.country_code || '').toUpperCase();
            if (countryCode === CL_COUNTRY_CODE) {
                updateForChile();
            }
        } catch (error) {
            return;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectCountryAndApply);
    } else {
        detectCountryAndApply();
    }
})();
