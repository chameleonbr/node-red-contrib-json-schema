module.exports = function(RED) {
    "use strict";
    function JsonSchemaValidator(n) {
        RED.nodes.createNode(this, n);
        this.func = n.func;
        this.name = n.name;
        this.pass = n.pass || false;
        var node = this;

        var Ajv = require('ajv');
        var ajv = Ajv({
            allErrors: true,
            messages: false
        });

        console.log(node.func);
        var validate = ajv.compile(JSON.parse(node.func));

        node.on('input', function(msg) {
            if (msg.payload !== undefined) {
                var valid = validate(msg.payload);
                if (!valid) {
                    msg['error'] = validate.errors;
                    if (node.pass) {
                        node.send(msg);
                    } else {
                        node.error('Invalid JSON', msg);
                    }
                }
                else {
                    node.send(msg);
                }
            }
        });

    }
    RED.nodes.registerType("json-schema", JsonSchemaValidator);
};
