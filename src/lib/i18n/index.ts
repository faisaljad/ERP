import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

register('en', () => import('./en.json'));
register('ar', () => import('./ar.json'));

// Get stored locale or fallback to browser locale
const storedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;

init({
    fallbackLocale: 'en',
    initialLocale: storedLocale || getLocaleFromNavigator(),
});

// Persist locale changes to localStorage
locale.subscribe((value) => {
    if (typeof localStorage !== 'undefined' && value) {
        localStorage.setItem('locale', value);
    }
});
