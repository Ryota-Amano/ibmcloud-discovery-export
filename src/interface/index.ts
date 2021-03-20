interface Credential {
  apikey: string,
  url: string,
  environmentId: string,
  collectionId: string,
  configurationId: string,
  version: string,
  exportName: string,
  description: string | null,
}

export const implementsCredential = (arg: any): arg is Credential => {
  return arg !== null && typeof arg === 'object'
    && typeof arg.apikey === 'string'
    && typeof arg.url === 'string'
    && typeof arg.environmentId === 'string'
    && typeof arg.collectionId === 'string'
    && typeof arg.configurationId === 'string'
    && typeof arg.version === 'string'
    && typeof arg.exportName === 'string'
    && (typeof arg.description === 'string' || arg.description === null)
}