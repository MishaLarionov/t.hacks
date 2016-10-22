var Client = require('node-wolfram');
var Wolfram = new Client('Y5HG77-K48RXVTG8V');
Wolfram.query("2+2", function(err, result) {
    if(err)
        console.log(err);
    else
    {
        for(var a=0; a<result.queryresult.pod.length; a++)
        {
            var pod = result.queryresult.pod[a];
            console.log(pod.$.title,": ");
            for(var b=0; b<pod.subpod.length; b++)
            {
                var subpod = pod.subpod[b];
                for(var c=0; c<subpod.plaintext.length; c++)
                {
                    var text = subpod.plaintext[c];
                    console.log('\t', text);
                }
            }
        }
    }
});