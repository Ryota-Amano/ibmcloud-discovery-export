import fs from 'fs'
import Path from 'path'
import yaml from 'js-yaml'
import { blue, bold, cyan, gray, green, red, yellow } from 'chalk'
import { readUserInput } from './src/UserInput'
import { implementsCredential } from './src/interface'
import { getAllDocuments } from './src/QueryCollection'
import { getConfiguration } from './src/ConfigurationDetails'
import { getTrainList } from './src/TrainingList'

const exportfoldername = 'export';
const authfilename = 'Authentication.yaml';

//IIFE 即時関数
(async function main() {

  //Start message & UserInput
  console.log(yellow('IBM Discovery ---Export CollectionData'))
  let saved_credential: string = ''
  if (fs.existsSync(`./${exportfoldername}`) && fs.readdirSync(`./${exportfoldername}`).length !== 0) {
    console.log('Do you want to use previously saved credentials?')
    saved_credential = await readUserInput(' y / n ? ')
  }

  let credential_obj = null
  if (saved_credential === 'y') {//以前に使用した資格情報を用いてexportを行う
    console.log(green('View credentials :'))

    const exportFolder = fs.readdirSync(`./${exportfoldername}`)
    for (const [index, auth] of exportFolder.entries()) {
      const path = `./${exportfoldername}/${auth}/${authfilename}`
      if (fs.existsSync(path)) {
        const yamlobj = yaml.load(fs.readFileSync(path, 'utf-8'))
        if (implementsCredential(yamlobj)) {
          console.log(yellow.bold(index + ' :'), gray(' -exportName'), cyan(yamlobj.exportName) + ',', gray('-description '), gray(yamlobj.description ? yamlobj.description : ''))
        }
      }
    }

    console.log(bold('Please select the index number to use.'))
    const index_number = await readUserInput('Index Number ? ')

    if (typeof index_number === 'number') {
      credential_obj = yaml.load(fs.readFileSync(`./${exportfoldername}/${exportFolder[index_number]}/${authfilename}`, 'utf-8'))
      console.log('number')
    } else {
      console.log('else')
    }
  } else {//新しい資格情報を用いてexportを行う
    try {
      credential_obj = yaml.load(fs.readFileSync(`./${authfilename}`, 'utf-8'))
    } catch (e) {
      console.log(red(`ERROR: ${authfilename} file could not be read.  Please rewrite in the correct format.`))
      process.exit()
    }
  }

  if (implementsCredential(credential_obj)) {
    const { apikey, url, environmentId, collectionId, configurationId, version, exportName } = credential_obj
    let overwrite = null

    //create export folder
    if (fs.existsSync(`./${exportfoldername}/${exportName}`)) {
      console.log(yellow(`WARN: The ${bold(exportName)} folder already exists. Do you want to overwrite and export ?`))
      overwrite = await readUserInput(' y / n ? ')
    } else {
      fs.mkdirSync(`./${exportfoldername}/${exportName}`, { recursive: true })
      overwrite = 'y'
    }

    if (overwrite === 'y') {
      console.log('Export Folder:', bold(Path.resolve() + `/${exportfoldername}/${exportName}`))

      //update Authentication.yaml
      if (fs.existsSync(`./${exportfoldername}/${exportName}/${authfilename}`)) {
        fs.unlinkSync(`./${exportfoldername}/${exportName}/${authfilename}`)
      }
      fs.copyFileSync(`./${authfilename}`, `./${exportfoldername}/${exportName}/${authfilename}`)


      //export Documents Data
      const res_documents = await getAllDocuments(url, apikey, environmentId, collectionId, version)
      if (res_documents) {
        fs.writeFileSync(`./${exportfoldername}/${exportName}/documents.json`, JSON.stringify(res_documents, null, 2))
      }

      //export Configuration Data
      const res_config = await getConfiguration(url, apikey, environmentId, configurationId, version)
      if (res_config) {
        fs.writeFileSync(`./${exportfoldername}/${exportName}/config.json`, JSON.stringify(res_config, null, 2))
      }

      //export Training List Data
      const res_train = await getTrainList(url, apikey, environmentId, collectionId, version)
      if (res_train) {
        fs.writeFileSync(`./${exportfoldername}/${exportName}/trainlist.json`, JSON.stringify(res_train, null, 2))

        //export csv
        //// change Listdata
        let records: any = []
        for (const [index, data] of res_train.entries()) {
          const listdata: any = []
          listdata.push(data.natural_language_query)
          for (const [index, exam] of data.examples.entries()) {
            listdata.push(exam.document_id)
            listdata.push(exam.relevance)
          }
          records.push(listdata)
        }
        //// change writeData
        let writeData: string[] = []
        if (records.length !== 0) {
          let writestr = ''
          for (const data of records) {
            writestr += data.join()
          }
          writeData.push(writestr)
        }
        fs.writeFileSync(`./${exportfoldername}/${exportName}/trainlist.csv`, writeData.join('\r\n'))
      }
    }
  }
  // const url: string = await readUserInput('url? ')
  // const apikey: string = await readUserInput('apikey? ')
  // const environmentid: string = await readUserInput('environmentId? ')
  // const collectionid: string = await readUserInput('collectionId? ')
  // //UserInput Check
  // if (!(url && apikey && environmentid && collectionid)) {
  //   console.log(red('Missing required parameters'))
  //   process.exit()
  // }
  // //Confirmation of deletion.
  // console.log(yellow.bold('All documents in the collection will be deleted. Also, once deleted, it cannot be undone. Do you really want to delete this?'))
  // const confirm: string = await readUserInput(' y / n ? ')

  // //All Document Delete
  // if (confirm === 'y') {
  //   let countFlag: boolean = true
  //   let deletecount = 0
  //   let alldocumentcount: number[] = []
  //   while (countFlag) {
  //     const { deleteIds, count, matching_results } = await getDocumentIDs(url, apikey, environmentid, collectionid)
  //     alldocumentcount.push(matching_results)
  //     deletecount += await deleteDocuments(url, apikey, environmentid, collectionid, deleteIds)
  //     if (count <= 1) countFlag = false
  //   }

  //   //End message
  //   if (fs.existsSync('./err.txt')) {
  //     console.log(yellow.bold('All Document Not Completed!!! Please check the error.txt'))
  //     console.log(`deleted: ${deletecount} / ${Math.max.apply(null, alldocumentcount)}`)
  //   } else {
  //     console.log(blue.bold('All Document Completed.') + `    deleted: ${deletecount} / ` + bold(`${Math.max.apply(null, alldocumentcount)}`))
  //   }
  // } else {
  //   console.log('...Canceled')
  // }

})()
