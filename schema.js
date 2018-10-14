const Ajv = require('ajv');

module.exports = function(RED) {
    "use strict";
    function JsonSchemaValidator(node) {
        RED.nodes.createNode(this, node);

        this.name = node.name;

        try {
            this.func = JSON.parse(node.func);
        } catch(e) {
            this.error(e.message);
        }

        if (this.func) {
            const validate = Ajv({
                allErrors: true,
            }).compile(node.func);

            this.on('input', msg => {
                const valid = validate(msg.payload);

                if (valid) {
                    this.send(msg);
                }
                else {
                    msg.error = validate.errors;
                    this.send(null, msg);
                }
            });
        }
    }

    RED.nodes.registerType("json-schema", JsonSchemaValidator);
};
