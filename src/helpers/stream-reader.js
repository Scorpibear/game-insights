/* FOR NODEJS
Utility function to read a ND-JSON fetch API output.
`processLine` is a function taking a JSON object. It will be called with each element of the stream.
`response` is the result of a `fetch` request.
(c) https://gist.github.com/ornicar/a097406810939cf7be1df8ea30e94f3e#file-nodejs-ndjson-stream-reader-js
*/
/* c8 ignore start */
export const readStream = (processLine) => (response) => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = "";

  const loop = () =>
    stream.read().then(({ done, value }) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;
        const parts = buf.split(matcher);
        buf = parts.pop();
        for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));
        return loop();
      }
    });

  return loop();
};
/* c8 ignore stop */
