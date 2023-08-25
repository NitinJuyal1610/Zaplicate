# **CleanMate** 🧹

Efficiently clean up your directories with **cleanMate** — a command-line tool packed with features for a streamlined cleanup process.

## **Features**

1. **Duplicate File Detection** 🔍
   Identify duplicate files using content hashing and transform streams. Eliminate redundant copies effortlessly.

2. **Scan Filters** 📁
   Focus your cleanup efforts with scan filters based on file size, extensions, and date ranges. Tailor the cleanup to your needs.

3. **Exclusion List** 🚫
   Preserve important files by excluding them from the cleanup process. Maintain control over what stays and what goes.

4. **Preview Mode** 👀
   Preview files marked for deletion before committing. Avoid accidental deletions and ensure accurate cleanup.

5. **Recursive Cleaning** 🔄
   Clean up subdirectories along with the main directory. Keep your entire directory structure organized.

6. **Custom Location** 🗂️
   Specify a custom location path for cleanup, ensuring flexibility and tailored directory cleanup.

7. **Auto Cleaning** 🤖
   Opt for automated cleanup without the preview step. Efficiently remove files based on your defined criteria.


  

Created by Nj

## **Usage**

To start the cleanup process for a specified directory, use the following command:

```bash
cleanup-assistant clean [options]
```
## **Options:**

- `--version`:
  Show the version number of the cleanup assistant.

- `--help`:
  Show help information for the cleanup assistant.

- `-l, --location <directory>`:
  Location of the directory to clean. Use a valid path.

- `-r, --recursive`:
  Perform recursive cleanup (including subdirectories).

- `-s, --minSize <size>`:
  Filter files larger than the specified size. Size format B, KB, MB, GB, TB, e.g., "100KB"

- `-S, --maxSize <size>`:
  Filter files smaller than the specified size. Size format B, KB, MB, GB, TB, e.g., "10MB".

- `-e, --extensions <extensions>`:
  Filter files by specified extensions. Provide space seperated extensions , e.g., .txt .jpg .png

- `-f, --from <date>`:
  Filter files modified from the specified date. Format: "YYYY-MM-DD".

- `-t, --to <date>`:
  Filter files modified until the specified date. Format: "YYYY-MM-DD".

- `-a, --auto`:
  Automatically remove files without preview.


## **Examples**

1. Clean duplicate file with size larger than equal to 12KB but     
      lesser than equal to 10MB.  
   ``cleanMate clean -s 12KB -S 10MB``
2. Recursively clean the directory with files with extension .txt and .jpg  
   ``cleanMate clean -r -e .txt .jpg``
1. Clean duplicate file created after 2023-08-15  
   ``cleanMate clean -f 2023-08-15``
1. Clean the directory at location recursively  
   ``cleanMate clean -l "C:\Users\Desktop\source" -r ``
