responseHelper = {
    send: function(template, model, request, response){
        if(request.headers.accept === 'application/json'){
            this.sendJson(model, response);
        }
        else{
            this.sendHtml(route, model, response);
        }       
    },
    sendJson: function(model, response){
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(JSON.stringify(model));
    },
    sendHtml: function(template, model, response){
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        var fileContents = fs.readFileSync(template, 'utf8');
        var rendered = templateHelper.renderTemplate(fileContents, model);
        response.end(rendered);
    }
};

module.exports = responseHelper;
