import { expansionData } from './api/Discovery'
import { red, blue } from 'chalk'
import { endloading, loading } from './Loading'


export const getExpansionList = async (url: string, apikey: string, environmentid: string, collection: string, version: string) => {
  //startLoading
  const loadingstart = loading('Get Expansion List')
  //Discovery get configuration
  const resexpansion = await expansionData(url, apikey, environmentid, collection, version)
  //endLoading
  endloading(loadingstart, 'Get Expansion List')

  //Discovery get configuration error Check
  if (resexpansion.status !== 200) {
    //Error
    console.log(red(`  ERROR: ${resexpansion.status}: ${resexpansion.statusText}`))
    console.log(`  message: ${resexpansion.message}`)
    return null
  } else {
    console.log(blue('  OK'))
    return resexpansion.result
  }
}