import fs from 'fs'
import Path from 'path'
import yaml from 'js-yaml'
import { bold, cyan, gray, green, red, yellow } from 'chalk'
import { readUserInput } from './src/UserInput'
import { implementsCredential } from './src/interface'
import { getAllDocuments } from './src/QueryCollection'
import { getConfiguration } from './src/ConfigurationDetails'
import { getTrainList } from './src/TrainingList'
import { getExpansionList } from './src/ExpansionList'

const exportfoldername = 'export';
const authfilename = 'Authentication.yaml';

//IIFE 即時関数
(async function main() {

  //Start message & UserInput
  console.log(yellow('IBM Discovery ---Export CollectionData'))
  let saved_credential: string = ''
  let index_num = null
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
    const index_str = await readUserInput('Index Number ? ')
    index_num = Number(index_str)
    if (!isNaN(index_num) && typeof index_num === 'number' && Number.isInteger(index_num)) {
      if (exportFolder[index_num]) {
        credential_obj = yaml.load(fs.readFileSync(`./${exportfoldername}/${exportFolder[index_num]}/${authfilename}`, 'utf-8'))
      } else {
        console.log(red(`no such file or directory, open ./${exportfoldername}/${exportFolder[index_num]}/${authfilename}`))
      }
    } else {
      console.log(red('Please select the index number to use.'))
    }
  } else {//新しい資格情報を用いてexportを行う
    try {
      credential_obj = yaml.load(fs.readFileSync(`./${authfilename}`, 'utf-8'))
    } catch (e) {
      console.log(red(`ERROR: ${authfilename} file could not be read.  Please rewrite in the correct format.`))
      process.exit()
    }
  }

  //Start Exports
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
        //// create Listdata
        let records: any = []
        for (const data of res_train) {
          const listdata: any = []
          listdata.push(data.natural_language_query)
          for (const exam of data.examples) {
            listdata.push(exam.document_id)
            listdata.push(exam.relevance)
          }
          records.push(listdata)
        }
        //// create writeData
        let writeData: string[] = []
        if (records.length !== 0) {
          for (const data of records) {
            writeData.push(data.join())
          }
        }
        fs.writeFileSync(`./${exportfoldername}/${exportName}/trainlist.csv`, writeData.join('\r\n'))
      }

      //export Expansion Data
      const res_expansion = await getExpansionList(url, apikey, environmentId, collectionId, version)
      if (res_expansion) {
        fs.writeFileSync(`./${exportfoldername}/${exportName}/expansion.json`, JSON.stringify(res_expansion, null, 2))
      }

      if (!(typeof index_num === 'number') && !(Number.isInteger(index_num))) {
        //update Authentication.yaml
        if (res_documents && res_config && res_train && res_expansion) {
          if (fs.existsSync(`./${exportfoldername}/${exportName}/${authfilename}`)) {
            fs.unlinkSync(`./${exportfoldername}/${exportName}/${authfilename}`)
          }
          fs.copyFileSync(`./${authfilename}`, `./${exportfoldername}/${exportName}/${authfilename}`)
        } else {
          console.log(red(`ERROR: There is an error in the ${authfilename}.`))
          console.log(red(`${authfilename} was not saved.`))
        }
      }
    } else if (overwrite === 'n') {
      console.log(bold("Change the 'exportName' in the yaml file."))
    } else {
      console.log(red("Please answer with 'y'or'n'."))
    }
  }
})()
