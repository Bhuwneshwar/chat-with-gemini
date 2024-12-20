const fs = require("fs");
const { promisify } = require("util");

// Promisify readFile and writeFile
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const getHistory = async () => {
    try {
        const data = await readFileAsync("history.json", "utf8");
        const DataArr = JSON.parse(data);
        // console.log(DataArr);
        return DataArr;
    } catch (err) {
        console.error("Error reading or parsing file:", err);
        return []; // Return an empty array in case of error
    }
};

const addHistory = async (userPrompt, modelAns) => {
    try {
        const DataArr = await getHistory();
        DataArr.push({
            role: "user",
            parts: [{ text: userPrompt }]
        });
        DataArr.push({
            role: "model",
            parts: [{ text: modelAns }]
        });

        const jsonData = JSON.stringify(DataArr, null, 2);

        await writeFileAsync("history.json", jsonData);
        // console.log("File has been written successfully");
    } catch (err) {
        console.error("Error updating history:", err);
    }
};

const addTenItem = (userPrompt, modelAns, arr) => {
    arr.push({
        role: "user",
        parts: [{ text: userPrompt }]
    });
    arr.push({
        role: "model",
        parts: [{ text: modelAns }]
    });
    if (arr.length > 20) {
        const removeCount = arr.length - 20;
        arr.splice(-removeCount);
    }
};
// addHistory("hi I'm Bhuwneshwar", "hello Bhubaneswar");

module.exports = { getHistory, addHistory, addTenItem };
