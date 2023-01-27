import {
  getFilesInDirectory,
  filerByFileExtention,
  readMultipleFiles,
  convertContentToJSON,
  mergeFileContent,
  uniqueUsers,
} from '../src/main';

import mock from 'mock-fs';
import { readFileSync } from 'fs';

describe('getFilesInDirectory', () => {
  const directory = `__tests__/data/`;

  const csvFileNames = [
    'ghas_active_committers_github_2023-01-27T0917.csv',
    'ghas_active_committers_github_2023-01-27T0918.csv',
  ];

  const allFileNames = [
    'empty-dir',
    'ghas_active_committers_github_2023-01-27T0917.csv',
    'ghas_active_committers_github_2023-01-27T0918.csv',
    'some-file.txt',
  ];

  const file1Content = readFileSync(
    `${directory}ghas_active_committers_github_2023-01-27T0917.csv`,
    { encoding: 'utf8' },
  );
  const file2Conent = readFileSync(
    `${directory}ghas_active_committers_github_2023-01-27T0918.csv`,
    { encoding: 'utf8' },
  );

  const isArrayUnique = (arr: string[]) =>
    Array.isArray(arr) && new Set(arr).size === arr.length;

  beforeAll(async () => {
    mock({
      '__tests__/data/': {
        'some-file.txt': 'file content here',
        'ghas_active_committers_github_2023-01-27T0917.csv': file1Content,
        'ghas_active_committers_github_2023-01-27T0918.csv': file2Conent,
        'empty-dir': {
          'some-file.txt': '{ "some": "json" }',
          'some-file-1.txt': '{ "new": "json" }',
        },
      },
      'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
      'some/other/path': {
        'some-file-2.txt': '{ "some": "json" }',
        'some-file-3.txt': '{ "new": "json" }',
      },
    });
  });

  afterAll(() => {
    mock.restore();
  });

  it('Read file within top level directory', async () => {
    const filesFoundInDirecotry = await getFilesInDirectory(directory);
    expect(filesFoundInDirecotry).toEqual(allFileNames);
  });

  it('Successfully filters out files that are not csv', async () => {
    const files = await getFilesInDirectory(directory);
    const csvFilesFound = await filerByFileExtention(files, '.csv');
    expect(csvFilesFound).toEqual(csvFileNames);
  });

  it('Successfully reads multiple CSVs', async () => {
    const files = await getFilesInDirectory(directory);
    const csvFilesFound = await filerByFileExtention(files, '.csv');
    const csvFiles = await readMultipleFiles(csvFilesFound);
    expect(csvFiles).toEqual([file1Content, file2Conent]);
  });

  it('Successfully converts al CSVs to JSON', async () => {
    const files = await getFilesInDirectory(directory);
    const csvFilesFound = await filerByFileExtention(files, '.csv');
    const csvFiles = await readMultipleFiles(csvFilesFound);
    const jsonFiles = await convertContentToJSON(csvFiles);
    jsonFiles.forEach(({ data }) => {
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
    });
  });

  it('Successfully merges the data in a single array', async () => {
    const files = await getFilesInDirectory(directory);
    const csvFilesFound = await filerByFileExtention(files, '.csv');
    const csvFiles = await readMultipleFiles(csvFilesFound);
    const jsonFiles = await convertContentToJSON(csvFiles);
    const content = await mergeFileContent(jsonFiles);
    const totalLength = jsonFiles.reduce(
      (acc, { data }) => acc + data.length,
      0,
    );
    expect(content).toBeInstanceOf(Array);
    expect(content).toHaveLength(totalLength);
    content.forEach((element) => {
      expect(element).toHaveProperty('User login');
      expect(element).toHaveProperty('Organization / repository');
      expect(element).toHaveProperty('Last pushed date');
    });
  });

  it('Successfully reduces unique users', async () => {
    const files = await getFilesInDirectory(directory);
    const csvFilesFound = await filerByFileExtention(files, '.csv');
    const csvFiles = await readMultipleFiles(csvFilesFound);
    const jsonFiles = await convertContentToJSON(csvFiles);
    const content = await mergeFileContent(jsonFiles);
    const unique = await uniqueUsers(content);
    expect(isArrayUnique(unique)).toBeTruthy();
  });
});
