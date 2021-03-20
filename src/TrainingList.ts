import { trainingData } from './api/Discovery'
import { red, blue } from 'chalk'


export const getTrainList = async (url: string, apikey: string, environmentid: string, configuration: string, version: string) => {
  //Discovery get configuration
  const restrain = await trainingData(url, apikey, environmentid, configuration, version)
  //Discovery get configuration error Check
  if (restrain.status !== 200) {
    //Error
    console.log('Get Training List', red(`ERROR: ${restrain.status}: ${restrain.statusText}`))
    console.log(`message: ${restrain.message}`)
    return null
  } else {
    console.log('Get Training List ', blue('OK'))
    return restrain.result.queries
  }
}