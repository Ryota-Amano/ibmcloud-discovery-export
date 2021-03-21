import { queryCollection } from './api/Discovery'
import { red, blue, yellow } from 'chalk'
import { endloading, loading } from './Loading'


export const getAllDocuments = async (url: string, apikey: string, environmentid: string, collectionid: string, version: string) => {
  //startLoading
  const loadingstart = loading('Query a collection')
  //Discovery query
  const resquery = await queryCollection(url, apikey, environmentid, collectionid, version)
  //endLoading
  endloading(loadingstart, 'Query a collection')
  //Discovery query error Check
  if (resquery.status !== 200) {
    //Error
    console.log(red(`  ERROR: ${resquery.status}: ${resquery.statusText}`))
    console.log(`  message: ${resquery.message}`)
    return null
  } else {
    console.log(blue('  OK'))
    const matching_results: number = resquery.result.matching_results

    //Over 10000 Documents
    if (matching_results > 10000) {
      console.log(yellow('  WARN: You have exceeded the number of documents you can export.'))
      console.log(yellow('        You can only export up to 10000 documents. Export up to 10000 documents.'))
    }

    //no document
    if (matching_results === 0) {
      console.log(yellow('WARN: There is no document.'))
    }

    return resquery.result
  }
}