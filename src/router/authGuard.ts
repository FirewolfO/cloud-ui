interface GuardTarget {
  name?: unknown
  fullPath: string
  meta: Record<string, unknown>
}

export function authenticationRedirect(target: GuardTarget, authenticated: boolean) {
  if (target.meta.requiresAuth && !authenticated) {
    return { name: 'auth', query: { redirect: target.fullPath } }
  }
  if (target.name === 'auth' && authenticated) {
    return { name: 'home' }
  }
  return undefined
}
