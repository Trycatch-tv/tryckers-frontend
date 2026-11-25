/**
 * Valida que una URL de retorno sea una ruta interna segura de la aplicación.
 */
export function getSafeReturnUrl(
  returnUrl: string | null | undefined,
): string | null {
  if (!returnUrl || !returnUrl.startsWith('/')) {
    return null;
  }

  if (returnUrl.startsWith('//') || returnUrl.includes('://')) {
    return null;
  }

  if (returnUrl.startsWith('/auth')) {
    return null;
  }

  return returnUrl;
}
