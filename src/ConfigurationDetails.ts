import { configutationDetails } from './api/Discovery'
import { red, blue } from 'chalk'
import { endloading, loading } from './Loading'


export const getConfiguration = async (url: string, apikey: string, environmentid: string, configuration: string, version: string) => {
  //startLoading
  const loadingstart = loading('Get configuration details')
  //Discovery get configuration
  const resconfig = await configutationDetails(url, apikey, environmentid, configuration, version)
  //endLoading
  endloading(loadingstart, 'Get configuration details')

  //Discovery get configuration error Check
  if (resconfig.status !== 200) {
    //Error
    console.log(red(`  ERROR: ${resconfig.status}: ${resconfig.statusText}`))
    console.log(`  message: ${resconfig.message}`)
    return null
  } else {
    console.log(blue('  OK'))
    return resconfig.result
  }
}