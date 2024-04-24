import dayjs from 'dayjs';
export function systemCurrentState(fs, filePath) {
    try {
    fs.readFile(filePath, 'utf8', function(err, data){
        if (err.code == 'ENOENT') console.error('File not exist!!');
        // Display the file content
        try{
        const resilt = JSON.parse(data);
            console.log(resilt);
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error(e.name);
            } else {
                console.error(e.message);
            }
        }
    });
} catch (e) {
        console.log(e.message);
}
}
export function today() {
    const day = dayjs().format('YYYY-MM-DD');
    return day;
}