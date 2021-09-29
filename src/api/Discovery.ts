import DiscoveryV1 from 'ibm-watson/discovery/v1'
import { IamAuthenticator } from 'ibm-watson/auth'

export const queryCollection = async (url: string, apikey: string, environment: string, collection: string, version: string) => {
  const discovery = new DiscoveryV1({
    version: version,
    authenticator: new IamAuthenticator({
      apikey: apikey,
    }),
    serviceUrl: url,
  });
  const queryParams = {
    environmentId: environment,
    collectionId: collection,
    count: 10000,
  };
  return discovery.query(queryParams).then(res => res).catch(err => err)
}

export const configutationDetails = async (url: string, apikey: string, environment: string, configuration: string, version: string) => {
  const discovery = new DiscoveryV1({
    version: version,
    authenticator: new IamAuthenticator({
      apikey: apikey,
    }),
    serviceUrl: url,
  });
  const getConfigurationParams = {
    environmentId: environment,
    configurationId: configuration,
  };
  return discovery.getConfiguration(getConfigurationParams).then(res => res).catch(err => err)
}


export const trainingData = async (url: string, apikey: string, environment: string, collection: string, version: string) => {
  const discovery = new DiscoveryV1({
    version: version,
    authenticator: new IamAuthenticator({
      apikey: apikey,
    }),
    serviceUrl: url,
  });
  const listTrainingDataParams = {
    environmentId: environment,
    collectionId: collection,
  };
  return discovery.listTrainingData(listTrainingDataParams).then(res => res).catch(err => err)
}

export const expansionData = async (url: string, apikey: string, environment: string, collection: string, version: string) => {
  const discovery = new DiscoveryV1({
    version: version,
    authenticator: new IamAuthenticator({
      apikey: apikey,
    }),
    serviceUrl: url,
  });
  const listExpansionsParams = {
    environmentId: environment,
    collectionId: collection,
  };
  return discovery.listExpansions(listExpansionsParams).then(res => res).catch(err => err)
}
