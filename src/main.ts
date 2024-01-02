import { readdirSync, readFileSync } from 'fs';
import { extname } from 'path';
import { parse, ParseResult } from 'papaparse';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const GLOBAL_DIRECTORY = process.env.DIRECTORY_OF_CSV_CONTENT || '';

export const getFilesInDirectory = async (folder: string) =>
  <string[]>readdirSync(folder).map((file) => file);

export const filerByFileExtention = async (files: string[], format: string) =>
  <string[]>files.filter((file) => extname(file).toLowerCase() === format);

export const readMultipleFiles = async (files: string[]) =>
  <string[]>(
    files.map((file) =>
      readFileSync(`${GLOBAL_DIRECTORY}${file}`, { encoding: 'utf8' }),
    )
  );

export const convertContentToJSON = async (files: string[]) =>
  files.map((file) => parse<CSVDataAsJson>(file, { header: true }));

export const mergeFileContent = async (data: ParseResult<CSVDataAsJson>[]) => {
  const mergedData: CSVDataAsJson[] = [];
  data.forEach((file) => {
    mergedData.push(...file.data);
  });
  return mergedData;
};

export const uniqueUsers = async (data: CSVDataAsJson[]) =>
  <string[]>(
    data
      .map((user) => user['User login'].toLowerCase())
      .filter((user, index, arr) => arr.indexOf(user) === index)
  );

const run = async () => {
  const files = await getFilesInDirectory(GLOBAL_DIRECTORY);
  const csvFilesFound = await filerByFileExtention(files, '.csv');
  const csvFiles = await readMultipleFiles(csvFilesFound);
  const jsonFiles = await convertContentToJSON(csvFiles);
  const content = await mergeFileContent(jsonFiles);
  const unique = await uniqueUsers(content);
  console.log(
    `You have a total of ${unique.length} unique developers across your GitHub instances.`,
  );
};

run();
