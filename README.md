# Collecting GHAS Unique Active Committers

## Purpose

The purpose of this repository is to help enterprise administrators who maintain multiple GHE instances work out unique developers across multiple GHE instances. This script works for both maximum committers and currently consumed GHAS committers. 

## Prerequisites

- [Node v18](https://nodejs.org/en/download/) or higher installed.
- [Git](https://git-scm.com/downloads) installed on the (user's) machine running this tool.

## Set up Instructions

1.  Clone this repository onto your local machine.

    ```bash
    git clone https://github.com/advanced-security/ghes-cross-instance-committers.git
    ```

2.  Change the directory to the repository you have just installed.

    ```bash
    cd ghes-cross-instance-committers
    ```

4.  Copy the `.env.sample` to `.env`. On a Mac, this can be done via the following terminal command:

    ```bash
    cp .env.sample .env
    ```

## Collecting the content

Head to the following URL in each of your GHES instances:

```
https://${ghes-url}.com/stafftools/ghas_committers
```

If you are interested in knowing your maximum committer number (e.g. the total number of unique developers across your whole GHE instance), click the download button next to the `Total billable committers if GHAS is enabled for all repositories` option. 

If you are interested in knowing your current committer number (e.g. the total number of unique developers across your whole GHE instance who are curently consuming a GHAS licence), click the download button next to the `Current active committer count` option.

Once that's downloaded, create a new folder and drop the CSV into that folder. 

Repeat the steps above across all your GHES instances. Make sure you drop the content **into the same folder**, you do not need to create a new folder every time. 

## Running the script

1.  Install dependencies

    ```bash
    npm install
    ```

3.  Update the `.env. (Replace the XXX with the relative directory of the csv content you created above)

    ```bash
    DIRECTORY_OF_CSV_CONTENT=XXX
    ```

2.  Run the script

    ```bash
    npm run start
    ```

The above script should output something like:

```
You have a total of XX unique developers across your GitHub instances.
```