
const { exec } = require("child_process");
const { error } = require("console");
const { stdout, stderr } = require("process");

module.exports = {

    loadserver: async () => {

        try {

            let cmd = '';

            cmd = `pm2 restart 3`;


            exec(cmd, (error, stdout, stderr) => {

                if (error) {
                    console.log(error)
                }

                if (stdout) {
                    console.log(stdout)
                }

                if (stderr) {
                    console.log(stderr)
                }

            })

        } catch (error) {
            console.log(error);

        }
    }
}
