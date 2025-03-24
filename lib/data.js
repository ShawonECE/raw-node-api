// dependencies
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// base directory of the data folder
const baseDir = path.join(__dirname, './../.data/');

// write data to file
export const create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${baseDir + dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (e) => {
                        if (!e) {
                            callback(false);
                        } else {
                            callback('Error closing new file!');
                        }
                    });
                } else {
                    callback('Error writing to new file!');
                }
            });
        } else {
            callback(error);
        }
    });
};

// read data from file
export const read = (dir, file, callback) => {
    fs.readFile(`${baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
export const update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (error) => {
                if (!error) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (e) => {
                        if (!e) {
                            fs.close(fileDescriptor, (er) => {
                                if (!er) {
                                    callback(false);
                                } else {
                                    callback('Error closing the file!');
                                }
                            });
                        } else {
                            callback('Error writing to existing file!');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            callback('Error updating. File may not exist!');
        }
    });
};

// delete existing file
export const deleteFile = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${baseDir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file!');
        }
    });
};
