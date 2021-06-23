module.exports = function(RED) {
    "use strict";
    function JsonSchemaValidator(n) {
        RED.nodes.createNode(this, n);
        this.func = n.func;
        this.name = n.name;
        var node = this;

        var Ajv = require('ajv');
        var ajv = Ajv({
            allErrors: true,
            messages: false
        });
        
        var validate = ajv.compile(JSON.parse(node.func));
        
        node.on('input', function(msg) {
            if (msg.payload !== undefined) {
                var valid = validate(msg.payload);
                if (!valid) {
                    msg['error'] = validate.errors;
                    node.error('Invalid JSON', msg);
                }
                else {
                    node.send(msg);
                }
            }
        });

    }
    RED.nodes.registerType("json-schema", JsonSchemaValidator);
};
