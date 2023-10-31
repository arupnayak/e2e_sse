// Define a function to read each chunk
const readChunk = (reader, response) => {
    // Read a chunk from the reader
    reader.read()
        .then(({
            value,
            done
        }) => {
            // Check if the stream is done
            if (done) {
                // Log a message
                console.log('Stream finished');
                response.end();
                // Return from the function
                return;
            }
            // Convert the chunk value to a string
            const chunkString = new TextDecoder().decode(value);
            // Log the chunk string
            console.log(chunkString);
            // Read the next chunk
            try {
                response.write(chunkString);
            } catch(e) {
                console.error(e);
            }
            
            readChunk(reader, response);
        })
        .catch(error => {
            // Log the error
            console.error(error);
        });
};

module.exports = {
    readChunk
}