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
            messages: true
        });
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
        
        node.on('input', function(msg) {
            if (msg.payload !== undefined) {
                console.log(node.func);
                var schema = typeof node.func === 'string' && node.func.trim().length ? JSON.parse(node.func) : typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema;
                var validate = ajv.compile(schema);
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
    RED.nodes.registerType("json-schema-validator", JsonSchemaValidator);
};