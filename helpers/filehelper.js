export function systemCurrentState(fs, filePath,fn) {
    try {
        let res = '';
    fs.readFile(filePath, 'utf8', function(err, data){
        if (err) console.error('File not exist!!');
        // Display the file content
        try{
         res = JSON.parse(data);
            // console.log(res);
            fn(res);
        } catch (e) {
            if (e instanceof SyntaxError) {
                fn(e);
            } else {
                console.error(e.message);
            }
        }
    });
} catch (e) {
        console.log(e.message);
}
}