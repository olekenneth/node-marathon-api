# Marathon API

# Install

`npm install --save marathon-api`

# How to use

```javascript
var Marathon = require('marathon-api');

var marathonClient = new Marathon({baseUrl: 'http://localhost:8080', appId: 'api.domain.com'});
var groupId = marathonClient.getGroupId();

marathonClient.getInstancesInGroup(groupId, function(err, result) {
    console.log(err, result);
});

```
