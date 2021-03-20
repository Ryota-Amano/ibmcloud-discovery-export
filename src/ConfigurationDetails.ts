import { configutationDetails } from './api/Discovery'
import { red, blue } from 'chalk'


export const getConfiguration = async (url: string, apikey: string, environmentid: string, configuration: string, version: string) => {
  //Discovery get configuration
  const resconfig = await configutationDetails(url, apikey, environmentid, configuration, version)
  //Discovery get configuration error Check
  if (resconfig.status !== 200) {
    //Error
    console.log('Get configuration details', red(`ERROR: ${resconfig.status}: ${resconfig.statusText}`))
    console.log(`message: ${resconfig.message}`)
    return null
  } else {
    console.log('Get configuration details ', blue('OK'))
    return resconfig.result
  }
}