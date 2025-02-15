const api = window.electronAPI;

const readFile = (filePath, callback) => {
    api.readFile(filePath)
        .then(data => {
            let lines = data.split("\n");
            callback(lines);
        })
        .catch(error => {
            throw new Error("File not read. Err:" + error);
        });
}


const writeFile = async (filePath, data) => {
    try {
        return await api.writeFile(filePath, data);
    } catch (error) {
        return {success: false, error: "File not written. Err: " + error};
    }
}


module.exports = {
    readFile,
    writeFile
}