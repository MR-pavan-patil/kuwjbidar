// 🔥 Force Kannada BEFORE Google script loads
(function() {
    var lang = "kn";
    var cookie = "googtrans=/en/" + lang;

    document.cookie = cookie + ";path=/";
    document.cookie = cookie + ";domain=" + location.hostname + ";path=/";
})();

// 🔥 Google Translate Init Function
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false,
        includedLanguages: 'kn,en,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
};