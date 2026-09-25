import { readdirSync, readFileSync } from 'fs';
import { extname } from 'path';
import { parse, ParseResult } from 'papaparse';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const GLOBAL_DIRECTORY = process.env.DIRECTORY_OF_CSV_CONTENT || '';

// Extended type to include email field (email might be optional)
type CSVDataWithEmail = {
  'User login': string;
  'Organization / repository': string;
  'Last pushed date': string;
  'Last pushed email'?: string;
};

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
  files.map((file) => parse<CSVDataWithEmail>(file, { header: true }));

export const mergeFileContent = async (data: ParseResult<CSVDataWithEmail>[]) => {
  const mergedData: CSVDataWithEmail[] = [];
  data.forEach((file) => {
    mergedData.push(...file.data);
  });
  return mergedData;
};

export const uniqueUsersByEmail = async (data: CSVDataWithEmail[]) =>
  <string[]>(
    data
      .map((user) => user['Last pushed email'])
      .filter((email): email is string => email != null && typeof email === 'string' && email.trim() !== '') // Type guard to filter out undefined, null, or empty emails
      .map((email) => email.toLowerCase())
      .filter((email, index, arr) => arr.indexOf(email) === index)
  );

const run = async () => {
  const files = await getFilesInDirectory(GLOBAL_DIRECTORY);
  const csvFilesFound = await filerByFileExtention(files, '.csv');
  const csvFiles = await readMultipleFiles(csvFilesFound);
  const jsonFiles = await convertContentToJSON(csvFiles);
  const content = await mergeFileContent(jsonFiles);
  const unique = await uniqueUsersByEmail(content);
  console.log(
    `You have a total of ${unique.length} unique developers (by email) across your GitHub instances.`,
  );
};

run();
