/** Clave con la que se recuerda el tema elegido en el navegador. */
export const THEME_STORAGE_KEY = "tf-theme";

/**
 * Script que corre antes de pintar la página para aplicar el tema guardado
 * y evitar el parpadeo entre temas. El tema por defecto es el oscuro.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})();`;
