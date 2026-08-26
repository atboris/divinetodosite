// Point de configuration UNIQUE pour tous les accès à l'application, sur tout
// le site. Tant que le web n'est pas déployé et l'installeur pas prêt, ces
// variables restent vides — on bascule vers un état honnête "bientôt
// disponible" plutôt qu'un lien mort ou trompeur.
export const APP_WEB_URL = import.meta.env.PUBLIC_APP_WEB_URL || null
export const APP_DOWNLOAD_URL = import.meta.env.PUBLIC_APP_DOWNLOAD_URL || null

export const isAppReady = Boolean(APP_WEB_URL || APP_DOWNLOAD_URL)

// Priorité au web (accessible immédiatement, sans installation) — sinon
// on renvoie vers le téléchargement desktop, sinon vers un état d'attente
export function getPrimaryAppLink(): string {
  return APP_WEB_URL ?? APP_DOWNLOAD_URL ?? '#application'
}