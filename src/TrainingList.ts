import { trainingData } from './api/Discovery'
import { red, blue } from 'chalk'
import { endloading, loading } from './Loading'


export const getTrainList = async (url: string, apikey: string, environmentid: string, configuration: string, version: string) => {
  //startLoading
  const loadingstart = loading('Get Training List')
  //Discovery get configuration
  const restrain = await trainingData(url, apikey, environmentid, configuration, version)
  //endLoading
  endloading(loadingstart, 'Get Training List')

  //Discovery get configuration error Check
  if (restrain.status !== 200) {
    //Error
    console.log(red(`  ERROR: ${restrain.status}: ${restrain.statusText}`))
    console.log(`  message: ${restrain.message}`)
    return null
  } else {
    console.log(blue('  OK'))
    return restrain.result.queries
  }
}