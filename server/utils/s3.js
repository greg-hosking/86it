import aws from 'aws-sdk';

import config from './env.js';

aws.config.update(
  {
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region,
  },
  function (err) {
    if (err) {
      console.log(err);
    }
  }
);

export default new aws.S3();
